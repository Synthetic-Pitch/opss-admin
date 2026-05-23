import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

type Submission = {
  id: number;
  created_at: string;
  license_valid_id: string;
  ovr: string;
  user_id: string;
};

type PendingResponse = {
  today: Submission[];
  yesterday: Submission[];
  dayBefore: Submission[];
  older: Submission[];
};

const fetchPendingRequests = async (): Promise<PendingResponse> => {
  const res = await fetch("https://gbvpdhqscwuaymsddvms.supabase.co/functions/v1/pending-request");
  if (!res.ok) throw new Error("Failed to fetch");
  return res.json();
};

const SubmissionGroup = ({ label, items }: { label: string; items: Submission[] }) => {
  const navigate = useNavigate();
  if (!items.length) return null;
  return (
    <div>
      <h2 className="font-bold text-[#606060] mb-2">{label}</h2>
      {items.map((item) => (
        <div key={item.id} className="bg-white flex gap-4 rounded-lg p-4 mb-2 shadow-sm cursor-pointer text-sm text-[#7d7c7c]" onClick={()=>{navigate(`/admin/${item.user_id}`)}}>
          <p>Id : {item.id}</p>
          <p>Platenumber : {item.user_id}</p>
        </div>
      ))}
    </div>
  );
};

const Admin = () => {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);
  
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/", { replace: true });
      } else {
        setAuthChecked(true);
      }
    });
  }, []);

  useEffect(()=>{
    if(sessionStorage.getItem("adminName") === null){
      navigate("/", { replace: true });
    }
  }, [])
  
  const { data, isLoading, isError } = useQuery({
    queryKey: ["pending-requests"],
    queryFn: fetchPendingRequests,
    enabled: authChecked,
  });

  if (!authChecked) return null;

  return (
    <div className="bg-[#E8E8E8] h-dvh w-full flex flex-col items-center tablet:px-4">
      <section className="w-full tablet:max-w-300 flex justify-end px-9 py-4 gap-2 font-poppins font-bold text-[#606060]">
        <h1>Administrator:</h1>
        <span>{sessionStorage.getItem("adminName")}</span>  
      </section>

      <p className="text-[#3F7CAB] w-full text-2xl font-bold flex justify-start font-poetsen tablet:max-w-300 px-4 tabet:px-0">
        pending request
      </p>

      <section className="w-full tablet:max-w-300 px-4 tablet:px-9 mt-4 flex flex-col gap-6 font-poppins">
        {isLoading && <p className="text-[#606060]">Loading...</p>}
        {isError && <p className="text-red-500">Failed to load requests.</p>}

        <SubmissionGroup label="Today" items={data?.today ?? []} />
        <SubmissionGroup label="Yesterday" items={data?.yesterday ?? []} />
        <SubmissionGroup label="2 Days Ago" items={data?.dayBefore ?? []} />
        <SubmissionGroup label="Older" items={data?.older ?? []} />
      </section>
    </div>
  );
};

export default Admin;