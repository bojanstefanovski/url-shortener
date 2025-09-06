import { useState } from "react";
import { Copy } from "lucide-react";
import { Button } from "./button";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <Button
      variant={copied ? "default" : "outline"}
      size="sm"
      onClick={copyToClipboard}
      className={`h-8 transition-colors ${copied ? 'bg-green-600 hover:bg-green-700 text-white' : ''} ${className}`}
    >
      <Copy className="h-3 w-3 mr-1" />
      {copied ? 'Copied!' : 'Copy'}
    </Button>
  );
}