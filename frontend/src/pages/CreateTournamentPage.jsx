import {
  CircleHelp,
  Link2,
  List,
  ListOrdered,
  Search,
  Trophy
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const sectionTitle = "mb-6 text-xs font-bold uppercase tracking-[0.16em] text-on-surface-variant";
const labelClass = "text-sm font-medium text-on-surface-variant md:pr-4 md:pt-2 md:text-right";
const fieldClass = "w-full rounded-md border border-outline-variant bg-surface-container-highest px-3 py-2.5 text-sm text-white placeholder:text-on-surface-variant/80 focus:border-tertiary-container focus:outline-none";

function slugify(value) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-") || `tournament-${Date.now()}`;
}

function CreateTournamentPage() {
  const navigate = useNavigate();
  const [host, setHost] = useState("ductinbk");
  const [tournamentName, setTournamentName] = useState("abc");
  const [description, setDescription] = useState("");
  const [game, setGame] = useState("League of Legends");
  const [tournamentType, setTournamentType] = useState("single_stage");
  const [format, setFormat] = useState("Single Elimination");
  const [registrationType, setRegistrationType] = useState("list");
  const [feeType, setFeeType] = useState("free");
  const [startTime, setStartTime] = useState("2026-05-12T19:01");

  const handleSaveAndContinue = () => {
    const tournamentId = slugify(tournamentName);
    navigate(`/app/tournaments/${tournamentId}`, {
      state: {
        tournament: {
          id: tournamentId,
          name: tournamentName,
          host,
          game,
          format,
          description,
          startTime,
          tournamentType,
          registrationType,
          feeType,
          participants: 0
        }
      }
    });
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] bg-surface">
      <header className="sticky top-14 z-10 border-b border-outline-variant bg-surface/95 px-4 py-4 backdrop-blur md:px-8 lg:px-12">
        <h1 className="mx-auto w-full max-w-4xl font-display text-3xl font-semibold italic tracking-tight text-white">
          New Tournament
        </h1>
      </header>

      <div className="px-4 pb-32 pt-6 md:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl space-y-8">
          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="p-6 md:p-8">
              <h2 className={sectionTitle}>Basic Info</h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Host</label>
                  <div className="md:col-span-3">
                    <select className={fieldClass} value={host} onChange={(event) => setHost(event.target.value)}>
                      <option value="ductinbk">ductinbk</option>
                      <option value="arenaadmin">arenaadmin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>Tournament name <span className="text-error">*</span></label>
                  <div className="md:col-span-3">
                    <input
                      className={`${fieldClass} border-tertiary-container/70 shadow-[0_0_0_1px_rgba(249,115,22,0.25)]`}
                      type="text"
                      value={tournamentName}
                      onChange={(event) => setTournamentName(event.target.value)}
                      autoFocus
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Description</label>
                  <div className="space-y-2 md:col-span-3">
                    <div className="flex flex-wrap items-center gap-1 rounded-t-md border border-b-0 border-outline-variant bg-surface-bright px-2 py-2 text-on-surface-variant">
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80">Paragraph</button>
                      <button type="button" className="rounded px-2 py-1 text-xs font-bold hover:bg-surface-bright/80">B</button>
                      <button type="button" className="rounded px-2 py-1 text-xs italic hover:bg-surface-bright/80">I</button>
                      <button type="button" className="rounded px-2 py-1 text-xs line-through hover:bg-surface-bright/80">S</button>
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80"><List size={14} /></button>
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80"><ListOrdered size={14} /></button>
                      <button type="button" className="rounded px-2 py-1 text-xs hover:bg-surface-bright/80"><Link2 size={14} /></button>
                    </div>
                    <textarea rows={6} className={`${fieldClass} rounded-t-none`} value={description} onChange={(event) => setDescription(event.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="p-6 md:p-8">
              <h2 className={sectionTitle}>Game Info</h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>Game <span className="text-error">*</span></label>
                  <div className="space-y-4 md:col-span-3">
                    <div className="rounded-lg border border-outline-variant bg-surface-container-highest p-4">
                      <p className="text-sm text-on-surface-variant">Putting a game allows your tournament to be discovered easier.</p>
                      <div className="relative mt-4">
                        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant/80" />
                        <input className={`${fieldClass} pl-9`} placeholder="The game or sport being played" value={game} onChange={(event) => setGame(event.target.value)} type="text" />
                      </div>
                      <div className="mt-4 border-t border-outline-variant pt-3 text-sm">
                        <p className="font-semibold text-white">Rankings impacted by this tournament:</p>
                        <p className="text-on-surface-variant">none — host your tournament as a community to unlock player and team ratings</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Type</label>
                  <div className="space-y-3 md:col-span-3">
                    <label className="flex items-start gap-3 text-sm text-white">
                      <input
                        checked={tournamentType === "single_stage"}
                        className="mt-0.5 h-4 w-4 border-outline-variant bg-surface-container-highest text-tertiary-container"
                        name="type"
                        onChange={() => setTournamentType("single_stage")}
                        type="radio"
                      />
                      Single Stage Tournament
                    </label>
                    <label className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <input
                        checked={tournamentType === "two_stage"}
                        className="mt-0.5 h-4 w-4 border-outline-variant bg-surface-container-highest text-tertiary-container"
                        name="type"
                        onChange={() => setTournamentType("two_stage")}
                        type="radio"
                      />
                      <span>
                        <strong className="text-on-surface">Two Stage Tournament</strong> — groups compete separately, winners proceed to final stage
                      </span>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>Format <span className="text-error">*</span></label>
                  <div className="space-y-3 md:col-span-3">
                    <select className={fieldClass} value={format} onChange={(event) => setFormat(event.target.value)}>
                      <option>Single Elimination</option>
                      <option>Double Elimination</option>
                      <option>Round Robin</option>
                      <option>Swiss</option>
                    </select>
                    <label className="flex items-center gap-2 text-sm text-on-surface-variant">
                      <input className="h-4 w-4 rounded border-outline-variant bg-surface-container-highest text-tertiary-container" type="checkbox" />
                      Break ties with placement matches
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-xl border border-outline-variant bg-surface-container-low">
            <div className="p-6 md:p-8">
              <h2 className={sectionTitle}>Registration</h2>

              <div className="space-y-8">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Registration</label>
                  <div className="space-y-3 md:col-span-3">
                    <label className="flex items-start gap-3 text-sm text-white">
                      <input
                        checked={registrationType === "list"}
                        className="mt-0.5 h-4 w-4 border-outline-variant bg-surface-container-highest text-tertiary-container"
                        name="reg"
                        onChange={() => setRegistrationType("list")}
                        type="radio"
                      />
                      Provide a list of participants
                    </label>
                    <label className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <input
                        checked={registrationType === "signup"}
                        className="mt-0.5 h-4 w-4 border-outline-variant bg-surface-container-highest text-tertiary-container"
                        name="reg"
                        onChange={() => setRegistrationType("signup")}
                        type="radio"
                      />
                      Host a sign-up page — allows custom questions for participants
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>Registration fee <span className="text-error">*</span></label>
                  <div className="md:col-span-3">
                    <div className="inline-flex rounded-md border border-outline-variant bg-surface-container-highest p-1">
                      <button
                        className={`rounded px-5 py-1.5 text-sm font-medium ${
                          feeType === "free" ? "bg-tertiary-container text-white" : "text-on-surface-variant hover:text-white"
                        }`}
                        onClick={() => setFeeType("free")}
                        type="button"
                      >
                        Free
                      </button>
                      <button
                        className={`rounded px-5 py-1.5 text-sm font-medium ${
                          feeType === "paid" ? "bg-tertiary-container text-white" : "text-on-surface-variant hover:text-white"
                        }`}
                        onClick={() => setFeeType("paid")}
                        type="button"
                      >
                        Paid
                      </button>
                    </div>
                    <p className="mt-2 inline-flex items-center gap-1 text-xs text-on-surface-variant">
                      <CircleHelp size={12} /> Paid registration is only available when hosting a sign-up page
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={labelClass}>Participants</label>
                  <div className="space-y-5 md:col-span-3">
                    <label className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <input className="mt-0.5 h-4 w-4 rounded border-outline-variant bg-surface-container-highest text-tertiary-container" type="checkbox" />
                      <span>
                        Require participants to register as a team
                        <span className="mt-1 block text-xs text-on-surface-variant/80">Team captains will register and invite members.</span>
                      </span>
                    </label>

                    <label className="flex items-start gap-3 text-sm text-on-surface-variant">
                      <input className="mt-0.5 h-4 w-4 rounded border-outline-variant bg-surface-container-highest text-tertiary-container" type="checkbox" />
                      Specify a maximum number of participants
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  <label className={`${labelClass} text-white`}>Start Time <span className="text-error">*</span></label>
                  <div className="space-y-3 md:col-span-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                      <input className={`${fieldClass} max-w-sm`} type="datetime-local" value={startTime} onChange={(event) => setStartTime(event.target.value)} />
                      <label className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
                        <input className="h-4 w-4 rounded border-outline-variant bg-surface-container-highest text-tertiary-container" type="checkbox" />
                        Mark as tentative
                      </label>
                    </div>
                    <p className="text-sm text-on-surface-variant">(GMT+07:00) Asia/Bangkok — set timezone from your account settings</p>
                    <label className="flex items-center gap-2 text-sm text-on-surface-variant/80">
                      <input className="h-4 w-4 rounded border-outline-variant bg-surface-container-low" disabled type="checkbox" />
                      Require participants to check in
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="sticky bottom-0 left-0 right-0 border-t border-outline-variant bg-surface-container-low/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex w-full max-w-4xl justify-end">
          <button
            type="button"
            onClick={handleSaveAndContinue}
            className="inline-flex items-center gap-2 rounded-full bg-tertiary-container px-8 py-3 text-sm font-bold uppercase tracking-wide text-white shadow-[0_8px_20px_rgba(249,115,22,0.35)] hover:bg-tertiary"
          >
            <Trophy size={16} /> Save and Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateTournamentPage;



