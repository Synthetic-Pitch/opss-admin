
import { FormEvent, useEffect, useRef, useState } from "react";

const SCANNER_ENDPOINT = "https://gbvpdhqscwuaymsddvms.supabase.co/functions/v1/scanner";

const Scanner = () => {
    const [qrcode, setQrcode] = useState("");
    const [message, setMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        const trimmedQrcode = qrcode.trim();

        if (!trimmedQrcode) {
            setMessage("Please scan a QR code.");
            return;
        }

        setIsSubmitting(true);
        setMessage("");

        try {
            const response = await fetch(SCANNER_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    apikey: import.meta.env.VITE_SECRET_KEY,
                    Authorization: `Bearer ${import.meta.env.VITE_SECRET_KEY}`,
                },
                body: JSON.stringify({ qrcode: trimmedQrcode }),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(data?.error ?? data?.message ?? "Failed to submit QR code.");
            }
            
            setMessage(data?.message ?? "QR code submitted successfully.");
            setQrcode("");
        } catch (error) {
            setMessage(error instanceof Error ? error.message : "Failed to submit QR code.");
        } finally {
            setIsSubmitting(false);
            inputRef.current?.focus();
        }
    };

    return (
        <div className="flex flex-col items-center justify-center h-dvh">
            <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
                <input
                    ref={inputRef}
                    type="text"
                    value={qrcode}
                    onChange={(event) => setQrcode(event.target.value)}
                    placeholder="Scan QR code"
                    className="outline-0 text-center"
                    autoFocus
                    disabled={isSubmitting}
                />
                {message ? <p className="text-center text-sm">{message}</p> : null}
            </form>
        </div>
    );
};

export default Scanner;
