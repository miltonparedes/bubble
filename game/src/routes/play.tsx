import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { GameCanvas } from "@/game/GameCanvas";
import { STARTING_CASH, UNICORN_VALUATION, VERSION } from "@bubble/logic";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { IconLogout } from "@tabler/icons-react";

export const Route = createFileRoute("/play")({
  component: PlayPage,
});

function PlayPage() {
  const { user, displayName, avatarUrl, loading, signOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate({ to: "/" });
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    navigate({ to: "/" });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 p-4">
      <div className="absolute right-4 top-4 flex items-center gap-3">
        {avatarUrl && (
          <img src={avatarUrl} alt="" className="size-8 rounded-full" />
        )}
        <span className="text-sm text-muted-foreground">
          {displayName}
        </span>
        <Button variant="ghost" size="sm" onClick={handleSignOut}>
          <IconLogout className="size-4" />
        </Button>
      </div>

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
