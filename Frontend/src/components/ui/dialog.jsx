import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = DialogPrimitive.Overlay;
const DialogClose = DialogPrimitive.Close;

const DialogContent = React.forwardRef(({ className, children, ...props }, ref) => {
  // Link aria-describedby to DialogDescription if present
  let descriptionId;
  React.Children.forEach(children, (child) => {
    if (
      React.isValidElement(child) &&
      child.type.displayName === "DialogDescription"
    ) {
      descriptionId = child.props.id || "dialog-description";
    }
  });

  return (
    <DialogPortal>
      <DialogOverlay className="fixed inset-0 bg-black/50 backdrop-blur-sm" aria-hidden="true" />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white p-6 shadow-lg focus:outline-none",
          className
        )}
        aria-describedby={descriptionId}
        {...props}
      >
        {children}
        <DialogClose className="absolute right-4 top-4 rounded-md p-1 opacity-70 transition hover:opacity-100">
          <X className="h-5 w-5" />
        </DialogClose>
      </DialogPrimitive.Content>
    </DialogPortal>
  );
});
DialogContent.displayName = "DialogContent";

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
));
DialogTitle.displayName = "DialogTitle";

const DialogDescription = React.forwardRef(({ id, className, ...props }, ref) => (
  <DialogPrimitive.Description ref={ref} id={id || "dialog-description"} className={cn("text-sm text-gray-500", className)} {...props} />
));
DialogDescription.displayName = "DialogDescription";

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogClose,
  DialogTitle,
  DialogDescription,
};
