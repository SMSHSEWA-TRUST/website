
const OmNamehShivaya = (): JSX.Element => {
    return (
        <section className="relative w-[1440px] h-[634px] mt-[5px] bg-[url(/bg-shiv.png)] bg-cover bg-[50%_50%]">
            <div className="absolute top-[85px] left-[126px] [text-shadow:10px_10px_4px_#00000040] [font-family:'Tiro_Devanagari_Hindi',Helvetica] text-white text-[173.3px] tracking-[0] font-normal leading-[normal]">
                ॐ नमः शिवाय
            </div>
            <img
                className="absolute w-[1124px] h-[634px] top-0 left-[316px]"
                alt="Image"
                src="/image-shiv.png"
            />
        </section>
    );
};

export default OmNamehShivaya; 