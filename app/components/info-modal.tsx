import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import type { Theme } from "@/lib/themes"

interface InfoModalProps {
  theme: Theme
}

export function InfoModal({ theme }: InfoModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Game Info</Button>
      </DialogTrigger>
      <DialogContent className="max-w-[800px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{theme.name} Theme - Game Information</DialogTitle>
          <DialogDescription>Learn about the game rules and payouts</DialogDescription>
        </DialogHeader>
        <div className="mt-4 space-y-4">
          <section>
            <h3 className="text-lg font-semibold">Grid Setup</h3>
            <p>{theme.gridSetup}</p>
          </section>
          <section>
            <h3 className="text-lg font-semibold">Symbol Values</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {Object.entries(theme.symbolValues).map(([symbol, value]) => (
                <div key={symbol} className="flex items-center space-x-2">
                  <span className="text-2xl">{symbol}</span>
                  <span>{value}</span>
                </div>
              ))}
            </div>
          </section>
          <section>
            <h3 className="text-lg font-semibold">Win Lines</h3>
            <div className="space-y-2">
              {theme.winLines.map((line, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="grid grid-cols-5 gap-1">
                    {line.line.map((position, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-primary flex items-center justify-center text-primary-foreground"
                      >
                        {position + 1}
                      </div>
                    ))}
                  </div>
                  <span>x{line.multiplier}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </DialogContent>
    </Dialog>
  )
}

