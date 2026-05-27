
import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

const SCANNER_ENDPOINT = "https://gbvpdhqscwuaymsddvms.supabase.co/functions/v1/scanner";
const SECTIONS = ["A", "B", "C", "D", "E", "F", "G", "H"];

type ScannerRecord = {
    UUID: string;
    plate_number: string;
    reference_number: string;
    payment_method: string;
    amount_paid: number;
    violation_count: number;
    vehicle_model: string;
    vehicle_type: string;
    vehicle_color: string;
};

const getRandomLocation = () => {
    const section = SECTIONS[Math.floor(Math.random() * SECTIONS.length)];
    const row = Math.floor(Math.random() * 9) + 1;

    return `Section ${section} Row ${row}`;
};

const formatScannerMessage = (text: string) => {
    return text
        .replace(/qr code not found/gi, "Vehicle not found")
        .replace(/qr code found/gi, "Vehicle found")
        .replace(/qr code submitted successfully/gi, "Vehicle found")
        .replace(/failed to submit qr code/gi, "Failed to submit vehicle");
};

const Scanner = () => {
    const [qrcode, setQrcode] = useState("");
    const [message, setMessage] = useState("");
    const [location, setLocation] = useState("");
    const [record, setRecord] = useState<ScannerRecord | null>(null);
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
            setLocation("");
            setRecord(null);
            return;
        }

        setIsSubmitting(true);
        setMessage("");
        setLocation("");
        setRecord(null);

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
                throw new Error(data?.error ?? data?.message ?? "Failed to submit vehicle.");
            }
            
            setMessage(formatScannerMessage(data?.message ?? "Vehicle found"));
            setRecord(data?.record ?? null);
            setLocation(getRandomLocation());
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : "Failed to submit vehicle.";
            setMessage(formatScannerMessage(errorMessage));
            setLocation("");
            setRecord(null);
        } finally {
            setIsSubmitting(false);
            requestAnimationFrame(() => {
                inputRef.current?.focus();
                inputRef.current?.select();
            });
        }
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
        if (event.key !== " ") {
            return;
        }

        event.preventDefault();
        setQrcode("");
        setMessage("");
        setLocation("");
        setRecord(null);
    };
    
    return (
        <div className="flex min-h-dvh flex-col items-center justify-center px-6 py-10 font-poppins">
            <form onSubmit={handleSubmit} className="flex w-full max-w-5xl flex-col items-center gap-4 md:gap-6 lg:gap-8">
                <input
                    ref={inputRef}
                    type="text"
                    value={qrcode}
                    onChange={(event) => setQrcode(event.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Scan QR code"
                    className="w-full outline-0 text-center text-base md:text-xl lg:text-2xl"
                    autoFocus
                    disabled={isSubmitting}
                />
                {message ? <p className="text-center text-2xl font-bold md:text-4xl lg:text-5xl">{message}</p> : null}
                {record ? (
                    <div className="grid w-full max-w-3xl grid-cols-1 gap-3 rounded-lg border border-slate-200 p-4 text-sm shadow-sm sm:grid-cols-2 md:text-base">
                        <div>
                            <p className="text-slate-500">Plate Number</p>
                            <p className="font-semibold">{record.plate_number}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Reference Number</p>
                            <p className="font-semibold">{record.reference_number}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Payment Method</p>
                            <p className="font-semibold">{record.payment_method}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Amount Paid</p>
                            <p className="font-semibold">PHP {record.amount_paid.toLocaleString()}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Violation Count</p>
                            <p className="font-semibold">{record.violation_count}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Vehicle Model</p>
                            <p className="font-semibold">{record.vehicle_model}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Vehicle Type</p>
                            <p className="font-semibold">{record.vehicle_type}</p>
                        </div>
                        <div>
                            <p className="text-slate-500">Vehicle Color</p>
                            <p className="font-semibold">{record.vehicle_color}</p>
                        </div>
                    </div>
                ) : null}
                {location ? (
                    <p className="max-w-full text-center text-5xl font-semibold leading-tight md:text-7xl lg:text-8xl">
                        {location}
                    </p>
                ) : null}
            </form>
        </div>
    );
};

export default Scanner;
