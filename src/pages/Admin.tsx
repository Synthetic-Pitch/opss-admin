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
  const data = await res.json();
  return data;
};

const formatSubmittedTime = (createdAt: string) => {
  const date = new Date(createdAt);
  if (Number.isNaN(date.getTime())) return createdAt;

  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const SubmissionGroup = ({ label, items }: { label: string; items: Submission[] }) => {
  const navigate = useNavigate();
  if (!items.length) return null;

  return (
    <section className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-[#23445d]">{label}</h2>
        <span className="rounded-full bg-[#e9f1f6] px-3 py-1 text-xs font-bold uppercase text-[#23445d]">
          {items.length} request{items.length === 1 ? "" : "s"}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 desktop:grid-cols-2">
        {items.map((item) => (
          <button
            key={item.id}
            type="button"
            className="group rounded-md border border-[#e0e4e8] bg-[#f8fafb] p-4 text-left transition hover:border-[#3f7cab] hover:bg-white hover:shadow-sm cursor-pointer"
            onClick={() => {
              navigate(`/admin/${item.user_id}`, {
                state: {
                  createdAt: item.created_at,
                  licenseValidId: item.license_valid_id,
                  ovr: item.ovr,
                },
              });
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase text-[#68717a]">Plate Number</p>
                <p className="mt-1 text-xl font-bold text-[#163247]">{item.user_id}</p>
              </div>
              <span className="rounded-full border border-[#d8dde3] bg-white px-3 py-1 text-xs font-bold text-[#68717a]">
                #{item.id}
              </span>
            </div>
            <div className="mt-4 border-t border-[#e0e4e8] pt-3">
              <p className="text-xs font-semibold uppercase text-[#68717a]">Submitted</p>
              <p className="mt-1 text-sm font-semibold text-[#1d2833]">{formatSubmittedTime(item.created_at)}</p>
            </div>
            <p className="mt-4 text-sm font-bold text-[#3f7cab] transition group-hover:text-[#23445d]">
              Open review
            </p>
          </button>
        ))}
      </div>
    </section>
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
  const todayCount = data?.today.length ?? 0;
  const yesterdayCount = data?.yesterday.length ?? 0;
  const olderCount = (data?.dayBefore.length ?? 0) + (data?.older.length ?? 0);
  const totalCount = todayCount + yesterdayCount + olderCount;
  const hasRequests = totalCount > 0;

  if (!authChecked) return null;

  return (
    <div className="min-h-dvh bg-[#eef1f4] font-poppins text-[#1d2833]">
      <header className="border-b border-[#d8dde3] bg-white">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-5 tablet:flex-row tablet:items-center tablet:justify-between tablet:px-6">
          <div>
            <p className="text-sm font-semibold uppercase text-[#61707f]">Admin Dashboard</p>
            <h1 className="font-poetsen text-3xl text-[#163247]">Pending Requests</h1>
          </div>
          <div className="rounded-md border border-[#d8dde3] bg-[#f8fafb] px-4 py-3 text-sm">
            <p className="font-semibold text-[#61707f]">Administrator</p>
            <p className="font-bold text-[#1d2833]">{sessionStorage.getItem("adminName")}</p>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-5 px-4 py-5 tablet:px-6">
        <section className="grid grid-cols-1 gap-3 tablet:grid-cols-4">
          <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[#68717a]">Total Pending</p>
            <p className="mt-1 text-2xl font-bold text-[#163247]">{totalCount}</p>
          </div>
          <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[#68717a]">Today</p>
            <p className="mt-1 text-2xl font-bold text-[#3f7cab]">{todayCount}</p>
          </div>
          <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[#68717a]">Yesterday</p>
            <p className="mt-1 text-2xl font-bold text-[#226b3a]">{yesterdayCount}</p>
          </div>
          <div className="rounded-lg border border-[#d8dde3] bg-white p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase text-[#68717a]">Earlier</p>
            <p className="mt-1 text-2xl font-bold text-[#8d3e3e]">{olderCount}</p>
          </div>
        </section>

        {isLoading && (
          <section className="rounded-lg border border-[#d8dde3] bg-white p-6 text-center font-semibold text-[#68717a] shadow-sm">
            Loading pending requests...
          </section>
        )}

        {isError && (
          <section className="rounded-lg border border-[#f1b8b8] bg-white p-6 text-center font-semibold text-[#bd4f4f] shadow-sm">
            Failed to load requests.
          </section>
        )}

        {!isLoading && !isError && !hasRequests && (
          <section className="rounded-lg border border-[#d8dde3] bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-bold text-[#23445d]">No pending requests</p>
            <p className="mt-1 text-sm font-semibold text-[#68717a]">New compliance submissions will appear here.</p>
          </section>
        )}

        {!isLoading && !isError && hasRequests && (
          <section className="flex flex-col gap-5">
            <SubmissionGroup label="Today" items={data?.today ?? []} />
            <SubmissionGroup label="Yesterday" items={data?.yesterday ?? []} />
            <SubmissionGroup label="2 Days Ago" items={data?.dayBefore ?? []} />
            <SubmissionGroup label="Older" items={data?.older ?? []} />
          </section>
        )}
      </main>
    </div>
  );
};

export default Admin;
