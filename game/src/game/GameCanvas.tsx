import { useEffect, useRef, useState } from "react";
import { BOARD_SIZE, UNICORN_VALUATION } from "@bubble/logic";

export function GameCanvas() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gameRef = useRef<Phaser.Game | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !containerRef.current || gameRef.current) return;

    // Dynamic import Phaser only on client
    import("phaser").then((Phaser) => {
      if (!containerRef.current || gameRef.current) return;

      // Create scene class with Phaser available
      class MainScene extends Phaser.Scene {
        constructor() {
          super({ key: "MainScene" });
        }

        create() {
          const { width, height } = this.scale;
          const boardSize = Math.min(width, height) * 0.7;
          const boardX = width / 2;
          const boardY = height / 2;

          const graphics = this.add.graphics();

          // Outer glow
          graphics.lineStyle(4, 0x7c3aed, 0.3);
          this.drawDiamond(graphics, boardX, boardY, boardSize + 20);

          // Main border
          graphics.lineStyle(2, 0x7c3aed, 0.7);
          this.drawDiamond(graphics, boardX, boardY, boardSize);

          // Inner grid lines
          graphics.lineStyle(1, 0x7c3aed, 0.2);
          for (let i = 1; i < 4; i++) {
            const offset = (boardSize / 4) * i;
            graphics.lineBetween(
              boardX - boardSize / 2 + offset / 2,
              boardY - offset / 2,
              boardX + boardSize / 2 - offset / 2,
              boardY - offset / 2,
            );
            graphics.lineBetween(
              boardX - boardSize / 2 + offset / 2,
              boardY + offset / 2,
              boardX + boardSize / 2 - offset / 2,
              boardY + offset / 2,
            );
          }

          // Info text
          this.add
            .text(
              width / 2,
              height - 30,
              `${BOARD_SIZE} tiles | Goal: $${(UNICORN_VALUATION / 1e9).toFixed(0)}B`,
              {
                fontSize: "14px",
                color: "#6b7280",
                fontFamily: "Inter Variable, system-ui, sans-serif",
              },
            )
            .setOrigin(0.5);
        }

        private drawDiamond(
          graphics: Phaser.GameObjects.Graphics,
          x: number,
          y: number,
          size: number,
        ) {
          const half = size / 2;
          graphics.beginPath();
          graphics.moveTo(x, y - half);
          graphics.lineTo(x + half, y);
          graphics.lineTo(x, y + half);
          graphics.lineTo(x - half, y);
          graphics.closePath();
          graphics.strokePath();
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: containerRef.current,
        width: 800,
        height: 600,
        backgroundColor: "#1a1a2e",
        scene: MainScene,
        scale: {
          mode: Phaser.Scale.FIT,
          autoCenter: Phaser.Scale.CENTER_BOTH,
        },
      };

      gameRef.current = new Phaser.Game(config);
    });

    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, [isClient]);

  if (!isClient) {
    return (
      <div className="flex h-[600px] w-[800px] items-center justify-center rounded-lg border border-border bg-card">
        <p className="text-muted-foreground">Loading game...</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="overflow-hidden rounded-lg border border-border shadow-xl"
    />
  );
}
