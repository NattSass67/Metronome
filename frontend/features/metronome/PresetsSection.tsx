"use client";

import { useState, useCallback, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Pattern } from "@/lib/types";
import type { Preset } from "@/lib/presets";
import { BUILT_IN_PRESETS } from "@/lib/presets";
import {
  getCustomPresets,
  saveCustomPreset,
  deleteCustomPreset,
} from "@/lib/presetStorage";
import { cn } from "@/lib/utils";

type PresetsSectionProps = {
  pattern: Pattern;
  onPatternChange: (pattern: Pattern) => void;
  className?: string;
};

export function PresetsSection({
  pattern,
  onPatternChange,
  className,
}: PresetsSectionProps) {
  const [customPresets, setCustomPresets] = useState<Preset[]>([]);
  const [saveName, setSaveName] = useState("");
  const [saveOpen, setSaveOpen] = useState(false);
  const [loadOpen, setLoadOpen] = useState(false);

  const refreshCustom = useCallback(() => {
    setCustomPresets(getCustomPresets());
  }, []);

  useEffect(() => {
    refreshCustom();
  }, [refreshCustom]);

  const handleSave = useCallback(() => {
    const name = saveName.trim();
    if (!name) return;
    saveCustomPreset(name, pattern);
    setSaveName("");
    setSaveOpen(false);
    refreshCustom();
  }, [pattern, saveName, refreshCustom]);

  const handleLoadPreset = useCallback(
    (preset: Preset) => {
      onPatternChange(preset.pattern);
      setLoadOpen(false);
    },
    [onPatternChange]
  );

  const handleDelete = useCallback(
    (e: React.MouseEvent, id: string) => {
      e.stopPropagation();
      deleteCustomPreset(id);
      refreshCustom();
    },
    [refreshCustom]
  );

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-wrap items-center gap-2">
        <Dialog open={loadOpen} onOpenChange={(open) => { setLoadOpen(open); if (open) refreshCustom(); }}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" aria-label="Open preset list to load a preset">
              Load preset
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Load preset</DialogTitle>
              <DialogDescription>
                Choose a built-in or saved preset to load.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2 max-h-[60vh] overflow-y-auto">
              <div>
                <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Built-in</p>
                <ul className="space-y-1 list-none p-0 m-0">
                  {BUILT_IN_PRESETS.map((preset) => (
                    <li key={preset.id}>
                      <Button
                        type="button"
                        variant="ghost"
                        className="w-full justify-start font-normal"
                        onClick={() => handleLoadPreset(preset)}
                        aria-label={`Load preset: ${preset.name}`}
                      >
                        {preset.name}
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
              {customPresets.length > 0 && (
                <div>
                  <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-2">Your presets</p>
                  <ul className="space-y-1 list-none p-0 m-0">
                    {customPresets.map((preset) => (
                      <li key={preset.id} className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          className="flex-1 justify-start font-normal"
                          onClick={() => handleLoadPreset(preset)}
                          aria-label={`Load preset: ${preset.name}`}
                        >
                          {preset.name}
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 shrink-0 text-zinc-500 hover:text-destructive"
                          onClick={(e) => handleDelete(e, preset.id)}
                          aria-label={`Delete preset: ${preset.name}`}
                        >
                          <Trash2 className="size-4" aria-hidden />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>

      <Dialog open={saveOpen} onOpenChange={setSaveOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" aria-label="Save current pattern as preset">
            Save current pattern
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save preset</DialogTitle>
            <DialogDescription>
              Give this pattern a name to save it to your presets. You can load it later from &quot;Your presets&quot;.
            </DialogDescription>
          </DialogHeader>
          <Input
            type="text"
            placeholder="Preset name"
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            aria-label="Preset name"
            className="mt-2"
          />
     
            <div className="flex flex-row gap-2 mt-4 justify-end">
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button
                type="button"
                onClick={handleSave}
                disabled={!saveName.trim()}
                aria-label="Save as custom preset"
              >
                Save
              </Button>
            </div>

        </DialogContent>
      </Dialog>
      </div>
    </div>
  );
}
