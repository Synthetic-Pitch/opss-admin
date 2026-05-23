
import img1 from "../assets/icons/marikinaCity_icon.png";
import img2 from "../assets/icons/opssTmeu.png";
import img3 from "../assets/icons/opssTmeuIcon.png";
import img4 from "../assets/icons/opsshanabi.png";
import Login from "../components/login";

const Landing = () => {
    
    return (
        <main className="">
            <section className='tablet:hidden relative h-dvh w-dvw flex flex-col bg-[#e8e8e8]'>
            <header className="bg-[#172a66] w-full h-25 rounded-b-full text-white flex items-center justify-center text-xl font-poetsen">
                <h1>OPSS ADMIN</h1>
            </header>
            <div className="flex justify-evenly select-none" >
                <img src={img1} alt="" className="h-25" draggable={false}/>
                <img src={img2} alt="" className="h-25" draggable={false}/>
            </div>
            <main className="bg-[#3f7cab] py-12 px-4 my-8">
                <Login/>
            </main>
            <div className="text-sm text-center font-poetsen text-[gray]">
                NCR Marikina City Phillipines {new Date().getFullYear()}
            </div>
            </section>

            <section className='hidden tablet:flex relative h-dvh w-dvw'>
            <div className='absolute top-0 left-0 h-full w-full flex flex-col bg-[#E8E8E8]'>
                <div className='flex h-[70%] w-full'>
                    <article className='h-full w-[75%]'>
                        <div className='h-[40%] w-full bg-[#172A66] rounded-[0_2%_52%_0/0_40%_200%_20%] flex items-center'>
                            <h1 className="text-white text-[3vh] pl-[16%]">OPSS PERSONEL PANEL</h1>
                        </div>
                    </article>
                    <aside className='h-full w-[20%] bg-[#E8E8E8] flex flex-col justify-evenly items-center pt-[4%] pl-[7%]'>
                        <img src={img1} alt="" className="h-[18%]" />
                        <img src={img2} alt="" className="h-[20%]" />
                        <img src={img3} alt="" className="h-[17%]" />
                        <img src={img4} alt="" className="h-[30%]" />
                    </aside>
                </div>
                <footer className='h-[35%] w-full flex bg-[#E8E8E8]'>
                    <div className='w-1/2 h-full bg-[#172A66] rounded-r-full'></div>
                    <div className='w-1/2 h-full bg-[#6FB7EE] rounded-l-full'></div>
                </footer>
            </div>
            <div className="pointer-events-none absolute top-0 left-0 h-full w-full z-30 flex">
                <div className="w-[8%] h-full flex items-center justify-center"> 
                    <span className="h-[85%] w-[4%] bg-white"/>
                </div>
                <div className="w-[84%] h-full flex flex-col justify-between items-center py-[2%]">
                    <div className=" w-full h-[.5%] bg-white"/>
                    <div className=" w-full h-[.5%] bg-white"/>
                </div>
                <div className="w-[8%] h-full flex items-center justify-center"> <span className="h-[85%] w-[4%] bg-white"/> </div>
            </div>
            <div className="absolute top-0 left-0 h-full w-full z-20 flex items-center">
                <main className="landing-pill-shadow w-[80%] h-[60%] bg-[#3F7CAB] rounded-r-full flex items-center pl-[10%]">
                    <Login/>
                </main>
            </div>
            </section>
        </main>
    )
}

export default Landing