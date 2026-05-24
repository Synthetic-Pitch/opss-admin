import { useState } from "react";
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
    violation: string;
    reference_number: string;
};

type AdminUserInfo = {
    vehicleInfo: VehicleInfo;
    transactionInfo: TransactionInfo;
    violationInfo: ViolationInfo[];
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
        <div className="flex flex-col items-center bg-[#E8E8E8] min-h-dvh">
            <section className="w-full tablet:max-w-300 flex justify-end px-9 py-4 gap-2 font-poppins font-bold text-[#606060]">
                <h1>Administrator:</h1>
                <span>{sessionStorage.getItem("adminName")}</span>
            </section>
            <section className="w-full tablet:max-w-300 py-4 px-2 tablet:px-4 flex flex-col gap-2 font-poppins">
                {
                    data ? (
                        <>  
                            <div className="px-4">
                                    <p className="w-full">Submitted : {formatCreatedAt(createdAt)}</p>
                                <p>platenumbe : {plateNumber}</p>
                            </div>
                            <hr />
                            
                            <main className="flex flex-col  tablet:flex-row tablet:items-center w-full gap-2">
                                <div className="px-4 w-[50%]">
                                    <p className="font-bold text-[#3f7cab] text-xl">vehicle.</p>
                                    <p>vehicle type : {data?.vehicleInfo.vehicle_type}</p>
                                    <p>vehicle model : {data?.vehicleInfo.vehicle_model}</p>
                                    <p>vehicle color : {data?.vehicleInfo.vehicle_color}</p>
                                </div>
                          
                               
                                <div className="px-4 w-[50%]">
                                     <p className="font-bold text-[#3f7cab] text-xl ">transaction</p>
                                    <p>transaction status : {data?.transactionInfo.transaction_status}</p>
                                    <p>is paid : {data?.transactionInfo.isPaid ? "Yes" : "No"}</p>
                                    <p>expiration date : {formatCreatedAt(data?.transactionInfo.expiration_date)}</p>
                                </div>
                            </main>
                            <hr />
                            <div className="px-4">
                                <p>total violations : {data?.violationInfo.length}</p>
                                <p>total reference numbers : {totalReferenceNumbers}</p>
                            </div>
                            <section className="bg-white py-2 px-4">
                                <p className="font-bold">violations :</p>
                                <div className="text-sm">
                                    {
                                        data.violationInfo.length > 0 ? (
                                            <ul className="list-none list-inside grid grid-cols-1 tablet:grid-cols-3 desktop:grid-cols-4">
                                                {data.violationInfo.map((violation, index) => (
                                                    <li key={index} className="px-4 py-4">
                                                        <p>Issued Date: {formatCreatedAt(violation.issued_date)}</p>
                                                        <p>Violation: {violation.violation}</p>
                                                        <p>Reference Number: {violation.reference_number}</p>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p>No violations found.</p>
                                        )
                                    }
                                </div>
                            </section>
                        </>
                    ):(<>Loading...</>)
                }
            </section>
            {
                !isLoading && (
                    <section className="w-full max-w-300 px-3 tablet:px-6 desktop:px-0">
                        <p className="py-8 text-center text-xl font-poetsen">driver's license/valid ID</p>
                        <button
                            type="button"
                            className="w-full cursor-zoom-in"
                            onClick={() => setInspectedImage({
                                src: licenseValidId,
                                alt: "Driver's License/Valid ID",
                            })}
                            aria-label="Inspect driver's license or valid ID image"
                        >
                            <img src={licenseValidId} alt="Driver's License/Valid ID" className="h-auto max-h-[65dvh] w-full object-contain tablet:max-h-[75dvh] desktop:h-120 desktop:max-h-none"/>
                        </button>
                        <p className="py-8 text-center text-xl font-poetsen">OVR</p>
                        <button
                            type="button"
                            className="w-full cursor-zoom-in"
                            onClick={() => setInspectedImage({
                                src: ovr,
                                alt: "OVR",
                            })}
                            aria-label="Inspect OVR image"
                        >
                            <img src={ovr} alt="OVR" className="h-auto max-h-[65dvh] w-full object-contain tablet:max-h-[75dvh] desktop:h-120 desktop:max-h-none"/>
                        </button>
                        <footer className="flex justify-evenly py-8 font-poppins font-bold text-2xl">
                            <button className="cursor-pointer text-[#bd4f4f]">reject compliance</button>
                            <button className="cursor-pointer text-[#18a418]">approve compliance</button>
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
