import { Toaster as Sonner, type ToasterProps } from "sonner";

export function Toaster(props: ToasterProps) {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast: "bg-zinc-900 border-zinc-800 text-zinc-50",
          title: "text-zinc-50",
          description: "text-zinc-400",
          actionButton: "bg-zinc-50 text-zinc-900",
          cancelButton: "bg-zinc-800 text-zinc-400",
          error: "bg-red-950 border-red-900 text-red-50",
          success: "bg-green-950 border-green-900 text-green-50",
        },
      }}
      {...props}
    />
  );
}
