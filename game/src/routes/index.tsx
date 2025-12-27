import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { IconRocket, IconTrophy, IconUsers, IconBrandGithub } from "@tabler/icons-react";
import { useAuth } from "@/lib/auth";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const { user, loading, signInWithGithub, signInAnonymously } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && !loading) {
      navigate({ to: "/play" });
    }
  }, [user, loading, navigate]);

  const handlePlayAsGuest = async () => {
    await signInAnonymously();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex flex-1 flex-col items-center justify-center gap-12 p-6">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="flex items-center gap-3">
            <div className="flex size-16 items-center justify-center rounded-full bg-primary/10 ring-1 ring-primary/20">
              <IconRocket className="size-8 text-primary" />
            </div>
          </div>
          <h1 className="text-6xl font-bold tracking-tight">
            BUBBLE
          </h1>
          <p className="max-w-md text-lg text-muted-foreground">
            Build your startup empire. Navigate the tech bubble.
            Race to unicorn status before the market crashes.
          </p>
        </div>

        <div className="grid max-w-2xl gap-4 sm:grid-cols-3">
          <FeatureCard
            icon={<IconRocket className="size-5" />}
            title="Build"
            description="Start in a garage, grow to a global tech giant"
          />
          <FeatureCard
            icon={<IconUsers className="size-5" />}
            title="Compete"
            description="Multiplayer board game for 2-6 players"
          />
          <FeatureCard
            icon={<IconTrophy className="size-5" />}
            title="Win"
            description="Reach $1B valuation to become a unicorn"
          />
        </div>

        <Card className="w-full max-w-sm">
          <CardHeader className="text-center">
            <CardTitle>Enter the Game</CardTitle>
            <CardDescription>
              Sign in to start your startup journey
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <Button onClick={handlePlayAsGuest} className="w-full">
              <IconRocket data-icon="inline-start" />
              Play as Guest
            </Button>
            <Button variant="outline" onClick={signInWithGithub} className="w-full">
              <IconBrandGithub data-icon="inline-start" />
              Sign in with GitHub
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="border-t py-4 text-center text-xs text-muted-foreground">
        <p>A multiplayer board game about tech startups</p>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center gap-2 rounded-none border border-border/50 bg-card/50 p-4 text-center">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary">
        {icon}
      </div>
      <h3 className="font-medium">{title}</h3>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}
