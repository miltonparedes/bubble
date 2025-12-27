import { createFileRoute } from "@tanstack/react-router";
import { GameCanvas } from "@/game/GameCanvas";
import { STARTING_CASH, UNICORN_VALUATION, VERSION } from "@bubble/logic";

export const Route = createFileRoute("/play")({
  component: PlayPage,
});

function PlayPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-primary">BUBBLE</h1>
        <p className="mt-2 text-muted-foreground">From Garage to IPO</p>
      </div>

      <GameCanvas />

      <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
        <p>
          Goal: Reach ${(UNICORN_VALUATION / 1e9).toFixed(0)}B valuation
        </p>
        <p className="text-xs">
          @bubble/logic v{VERSION} | Starting Cash: ${(STARTING_CASH / 1000).toFixed(0)}k
        </p>
      </div>
    </div>
  );
}
