"""Migrate schema: users->accounts, add players, update participants

Revision ID: 001_schema_refactor
Revises: 
Create Date: 2026-05-13
"""
import sqlalchemy as sa

from alembic import op

# revision identifiers, used by Alembic.
revision = '001_schema_refactor'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # Create new accounts table (from users)
    op.create_table(
        'accounts',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('username', sa.String(100), nullable=False, unique=True),
        sa.Column('hashed_password', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        sa.Column('role', sa.String(50), nullable=False, server_default='USER'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username'),
    )

    # Create players table
    op.create_table(
        'players',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('display_name', sa.String(255), nullable=False),
        sa.Column('avatar_url', sa.String(500), nullable=True),
        sa.Column('created_by', sa.BigInteger(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )

    # Drop old constraints and update tournaments
    op.drop_constraint('tournaments_host_id_fkey', 'tournaments', type_='foreignkey')

    # Update participants: drop old constraints and recreate
    op.drop_constraint('participants_user_id_fkey', 'participants', type_='foreignkey')
    op.drop_constraint('participants_tournament_id_fkey', 'participants', type_='foreignkey')
    op.drop_constraint('uq_participant', 'participants', type_='unique')
    
    # Rename user_id to player_id
    op.alter_column('participants', 'user_id', new_column_name='player_id')
    
    # Recreate unique constraint with new column name
    op.create_unique_constraint('uq_participant', 'participants', ['tournament_id', 'player_id'])
    op.create_index('idx_participants_tournament_id', 'participants', ['tournament_id'])
    op.create_index('idx_participants_player_id', 'participants', ['player_id'])

    # Update announcements
    op.drop_constraint('announcements_author_id_fkey', 'announcements', type_='foreignkey')
    op.drop_constraint('announcements_tournament_id_fkey', 'announcements', type_='foreignkey')
    
    # Add is_pinned column if not exists
    try:
        op.add_column('announcements', sa.Column('is_pinned', sa.Boolean(), nullable=False, server_default='false'))
    except:
        pass  # Column already exists
    
    # Drop announcement_type if exists
    try:
        op.drop_column('announcements', 'announcement_type')
    except:
        pass  # Column doesn't exist
    
    op.create_index('idx_announcements_tournament_id', 'announcements', ['tournament_id'])

    # Update matches
    op.drop_constraint('matches_tournament_id_fkey', 'matches', type_='foreignkey')
    op.drop_constraint('matches_player1_id_fkey', 'matches', type_='foreignkey')
    op.drop_constraint('matches_player2_id_fkey', 'matches', type_='foreignkey')
    op.drop_constraint('matches_winner_id_fkey', 'matches', type_='foreignkey')
    op.drop_constraint('matches_loser_id_fkey', 'matches', type_='foreignkey')
    try:
        op.drop_constraint('matches_next_match_id_fkey', 'matches', type_='foreignkey')
    except:
        pass
    try:
        op.drop_constraint('matches_loser_next_match_id_fkey', 'matches', type_='foreignkey')
    except:
        pass
    
    # Drop old columns and add new ones
    try:
        op.drop_column('matches', 'bracket_type')
    except:
        pass
    try:
        op.drop_column('matches', 'score_player1')
        op.drop_column('matches', 'score_player2')
    except:
        pass
    try:
        op.drop_column('matches', 'next_match_id')
        op.drop_column('matches', 'loser_next_match_id')
    except:
        pass
    
    # Add new columns
    try:
        op.add_column('matches', sa.Column('score1', sa.Integer(), nullable=True))
    except:
        pass
    try:
        op.add_column('matches', sa.Column('score2', sa.Integer(), nullable=True))
    except:
        pass
    try:
        op.add_column('matches', sa.Column('bracket', sa.String(20), nullable=False, server_default='MAIN'))
    except:
        pass
    try:
        op.add_column('matches', sa.Column('scheduled_at', sa.String(50), nullable=True))
    except:
        pass
    try:
        op.add_column('matches', sa.Column('finished_at', sa.String(50), nullable=True))
    except:
        pass
    
    # Update match status default
    op.alter_column('matches', 'status', existing_type=sa.String(50), server_default='SCHEDULED')
    
    op.create_index('idx_matches_tournament_id', 'matches', ['tournament_id'])

    # Update standings
    op.drop_constraint('standings_tournament_id_fkey', 'standings', type_='foreignkey')
    op.drop_constraint('standings_participant_id_fkey', 'standings', type_='foreignkey')
    
    # Rename columns
    try:
        op.alter_column('standings', 'wins', new_column_name='won')
    except:
        pass
    try:
        op.alter_column('standings', 'losses', new_column_name='lost')
    except:
        pass
    try:
        op.alter_column('standings', 'draws', new_column_name='draw')
    except:
        pass
    try:
        op.drop_column('standings', 'score_diff')
    except:
        pass
    
    # Add new columns if not exists
    try:
        op.add_column('standings', sa.Column('played', sa.Integer(), nullable=False, server_default='0'))
    except:
        pass
    try:
        op.add_column('standings', sa.Column('score_for', sa.Integer(), nullable=False, server_default='0'))
    except:
        pass
    try:
        op.add_column('standings', sa.Column('score_against', sa.Integer(), nullable=False, server_default='0'))
    except:
        pass
    
    # Make rank nullable
    op.alter_column('standings', 'rank', existing_type=sa.Integer(), nullable=True)
    
    op.create_index('idx_standings_tournament_id', 'standings', ['tournament_id'])

    # Drop old users table
    op.drop_table('users')


def downgrade() -> None:
    # Recreate users table
    op.create_table(
        'users',
        sa.Column('id', sa.BigInteger(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('username', sa.String(100), nullable=False),
        sa.Column('password_hash', sa.Text(), nullable=False),
        sa.Column('role', sa.String(20), nullable=False, server_default='PLAYER'),
        sa.Column('avatar_url', sa.Text(), nullable=True),
        sa.Column('bio', sa.Text(), nullable=True),
        sa.Column('country', sa.String(100), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email'),
        sa.UniqueConstraint('username'),
    )

    # Drop new tables
    op.drop_table('accounts')
    op.drop_table('players')

    # Rename participant columns back
    op.alter_column('participants', 'player_id', new_column_name='user_id')
    op.drop_constraint('uq_participant', 'participants', type_='unique')
    op.create_unique_constraint('uq_participant', 'participants', ['tournament_id', 'user_id'])

    # Restore FKs and other changes (simplified)
