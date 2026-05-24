import { useState, type ReactNode } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation, useParams } from "react-router-dom";

type VerifyPageState = {
    createdAt?: string;
    licenseValidId?: string;
    ovr?: string;
};

type VehicleInfo = {
    vehicle_model: string;
    vehicle_type: string;
    vehicle_color: string;
};

type TransactionInfo = {
    transaction_status: string;
    isPaid: boolean;
    expiration_date: string;
};

type ViolationInfo = {
    issued_date: string;
    issued_location: string;
    violation: string;
    reference_number: string;
};

type AdminUserInfo = {
    vehicleInfo: VehicleInfo;
    transactionInfo: TransactionInfo;
    violationInfo: ViolationInfo[];
};

type DetailItemProps = {
    label: string;
    value: ReactNode;
};

type InfoPanelProps = {
    title: string;
    children: ReactNode;
};

const formatCreatedAt = (createdAt?: string) => {
    if (!createdAt) return "Unknown";

    const date = new Date(createdAt);
    if (Number.isNaN(date.getTime())) return createdAt;

    return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
    });
};

const fetchAdminUserInfo = async (plateNumber: string): Promise<AdminUserInfo> => {
    const res = await fetch("https://gbvpdhqscwuaymsddvms.supabase.co/functions/v1/admin-user-info", {
        method: "POST",
        headers: {
            "apikey": import.meta.env.VITE_PUBLISHABLE_KEY,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ platenumber: plateNumber }),
    });
    if (!res.ok) throw new Error("Failed to fetch admin user info");
    
    return res.json();
};

const DetailItem = ({ label, value }: DetailItemProps) => (
    <div className="rounded-md bg-[#f8fafb] px-4 py-3">
        <p className="text-xs font-semibold uppercase text-[#68717a]">{label}</p>
        <p className="mt-1 break-words text-base font-semibold text-[#1d2833]">{value}</p>
    </div>
);

const InfoPanel = ({ title, children }: InfoPanelProps) => (
    <section className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-bold text-[#23445d]">{title}</h2>
        <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2">{children}</div>
    </section>
);

const VerifyPage = () => {
    const { plateNumber } = useParams<{ plateNumber: string }>();
    const location = useLocation();
    const { createdAt, licenseValidId, ovr } = (location.state ?? {}) as VerifyPageState;
    const [inspectedImage, setInspectedImage] = useState<{
        src?: string;
        alt: string;
    } | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ["admin-user-info", plateNumber],
        queryFn: () => fetchAdminUserInfo(plateNumber as string),
        enabled: Boolean(plateNumber),
    });
    const totalReferenceNumbers = new Set(
        data?.violationInfo.map((violation) => violation.reference_number)
    ).size; 
    
    if(!plateNumber) return <div>No plate number provided</div>;
    
    return (
        <div className="min-h-dvh bg-[#eef1f4] font-poppins text-[#1d2833]">
            <header className="border-b border-[#d8dde3] bg-white">
                <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6">
                    <div>
                        <p className="text-sm font-semibold uppercase text-[#61707f]">Compliance Review</p>
                        <h1 className="text-2xl font-bold text-[#163247] tablet:text-3xl">{plateNumber}</h1>
                        <span className="text-[12px]">platenumber</span>
                    </div>
                    <div className="rounded-md border border-[#d8dde3] bg-[#f8fafb] px-4 py-3 text-sm">
                        <p className="font-semibold text-[#61707f]">Administrator</p>
                        <p className="font-bold text-[#1d2833]">{sessionStorage.getItem("adminName")}</p>
                    </div>
                </div>
            </header>

            <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 tablet:px-6">
                {
                    data ? (
                        <>  
                            <section className="grid grid-cols-1 gap-3 tablet:grid-cols-3">
                                <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-[#68717a]">Submitted</p>
                                    <p className="mt-1 text-xl font-bold text-[#163247]">{formatCreatedAt(createdAt)}</p>
                                </div>
                                <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-[#68717a]">Violations</p>
                                    <p className="mt-1 text-xl font-bold text-[#8d3e3e]">{data.violationInfo.length}</p>
                                </div>
                                <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
                                    <p className="text-xs font-semibold uppercase text-[#68717a]">Reference Numbers</p>
                                    <p className="mt-1 text-xl font-bold text-[#226b3a]">{totalReferenceNumbers}</p>
                                </div>
                            </section>

                            <div className="grid grid-cols-1 gap-5 desktop:grid-cols-2">
                                <InfoPanel title="Vehicle Information">
                                    <DetailItem label="Plate Number" value={plateNumber} />
                                    <DetailItem label="Vehicle Type" value={data.vehicleInfo.vehicle_type} />
                                    <DetailItem label="Vehicle Model" value={data.vehicleInfo.vehicle_model} />
                                    <DetailItem label="Vehicle Color" value={data.vehicleInfo.vehicle_color} />
                                </InfoPanel>

                                <InfoPanel title="Transaction Information">
                                    <DetailItem label="Status" value={data.transactionInfo.transaction_status} />
                                    <DetailItem label="Payment" value={data.transactionInfo.isPaid ? "Paid" : "Unpaid"} />
                                    <DetailItem label="Expiration Date" value={formatCreatedAt(data.transactionInfo.expiration_date)} />
                                </InfoPanel>
                            </div>

                            <section className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
                                <div className="mb-4 flex flex-col gap-1 tablet:flex-row tablet:items-end tablet:justify-between">
                                    <h2 className="text-lg font-bold text-[#23445d]">Violation Records</h2>
                                    <p className="text-sm font-semibold text-[#68717a]">{data.violationInfo.length} record(s)</p>
                                </div>
                                <div className="grid grid-cols-1 gap-3 tablet:grid-cols-2 desktop:grid-cols-3">
                                    {
                                        data.violationInfo.length > 0 ? (
                                            data.violationInfo.map((violation, index) => (
                                                <article key={index} className="rounded-md border border-[#e0e4e8] bg-[#f8fafb] p-4">
                                                    <p className="text-xs font-semibold uppercase text-[#68717a]">Issued Date</p>
                                                    <p className="font-bold text-[#1d2833]">{formatCreatedAt(violation.issued_date)}</p>
                                                    <p className="mt-3 text-xs font-semibold uppercase text-[#68717a]">Issued Location</p>
                                                    <p className="font-semibold text-[#1d2833]">{violation.issued_location}</p>
                                                    <p className="mt-3 text-xs font-semibold uppercase text-[#68717a]">Violation</p>
                                                    <p className="font-semibold text-[#1d2833]">{violation.violation}</p>
                                                    <p className="mt-3 text-xs font-semibold uppercase text-[#68717a]">Reference Number</p>
                                                    <p className="break-words font-mono text-sm font-bold text-[#23445d]">{violation.reference_number}</p>
                                                </article>
                                            ))
                                        ) : (
                                            <p className="rounded-md bg-[#f8fafb] px-4 py-5 text-[#68717a]">No violations found.</p>
                                        )
                                    }
                                </div>
                            </section>
                        </>
                    ):(<div className="rounded-lg border border-[#d8dde3] bg-white p-6 text-center font-semibold text-[#68717a] shadow-sm">Loading review details...</div>)
                }
            </main>

            {
                !isLoading && (
                    <section className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-5 px-4 pb-6 tablet:px-6 desktop:grid-cols-2">
                        <article className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h2 className="font-poetsen text-xl text-[#23445d]">Driver's License / Valid ID</h2>
                                <span className="rounded-full bg-[#e9f1f6] px-3 py-1 text-xs font-bold uppercase text-[#23445d]">Tap to inspect</span>
                            </div>
                            <button
                                type="button"
                                className="flex min-h-72 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-md bg-[#eef1f4]"
                                onClick={() => setInspectedImage({
                                    src: licenseValidId,
                                    alt: "Driver's License/Valid ID",
                                })}
                                aria-label="Inspect driver's license or valid ID image"
                            >
                                <img src={licenseValidId} alt="Driver's License/Valid ID" className="h-auto max-h-[65dvh] w-full object-contain tablet:max-h-[70dvh] desktop:h-120 desktop:max-h-none"/>
                            </button>
                        </article>

                        <article className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <h2 className="font-poetsen text-xl text-[#23445d]">OVR</h2>
                                <span className="rounded-full bg-[#e9f1f6] px-3 py-1 text-xs font-bold uppercase text-[#23445d]">Tap to inspect</span>
                            </div>
                            <button
                                type="button"
                                className="flex min-h-72 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-md bg-[#eef1f4]"
                                onClick={() => setInspectedImage({
                                    src: ovr,
                                    alt: "OVR",
                                })}
                                aria-label="Inspect OVR image"
                            >
                                <img src={ovr} alt="OVR" className="h-auto max-h-[65dvh] w-full object-contain tablet:max-h-[70dvh] desktop:h-120 desktop:max-h-none"/>
                            </button>
                        </article>

                        <footer className="flex flex-col gap-3 rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm tablet:flex-row tablet:items-center tablet:justify-between desktop:col-span-2">
                            <button className="rounded-md bg-[#a82020] px-6 py-3 font-bold text-white transition hover:bg-[#861919] cursor-pointer">Red Notice</button>
                            <div className="flex flex-col gap-3 tablet:flex-row tablet:justify-end">
                                <button className="rounded-md border border-[#bd4f4f] px-6 py-3 font-bold text-[#bd4f4f] transition hover:bg-[#bd4f4f] hover:text-white cursor-pointer">Reject Compliance</button>
                                <button className="rounded-md bg-[#188c3a] px-6 py-3 font-bold text-white transition hover:bg-[#126f2d] cursor-pointer">Approve Compliance</button>
                            </div>
                        </footer>
                    </section>
                )
            }
            {
                inspectedImage?.src && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4">
                        <button
                            type="button"
                            className="absolute right-4 top-4 flex size-11 items-center justify-center rounded-full bg-white text-3xl leading-none text-black shadow-lg cursor-pointer"
                            onClick={() => setInspectedImage(null)}
                            aria-label="Close image inspection"
                        >
                            &times;
                        </button>
                        <img
                            src={inspectedImage.src}
                            alt={inspectedImage.alt}
                            className="max-h-full max-w-full object-contain"
                        />
                    </div>
                )
            }
            
        </div>
    );
};

export default VerifyPage; 
