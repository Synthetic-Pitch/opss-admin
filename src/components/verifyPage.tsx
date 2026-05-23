import { useParams } from "react-router-dom";

const VerifyPage = () => {
    const { plateNumber } = useParams<{ plateNumber: string }>();
    if(!plateNumber) return <div>No plate number provided</div>;
    
    return (
        <div>
            <section className="w-full tablet:max-w-300 flex justify-end px-9 py-4 gap-2 font-poppins font-bold text-[#606060]">
                <h1>Administrator:</h1>
                <span>{sessionStorage.getItem("adminName")}</span>
            </section>
        </div>
    );
};

export default VerifyPage;