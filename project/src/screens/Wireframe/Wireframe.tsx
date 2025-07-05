import React from "react";
import { Avatar } from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../../components/ui/navigation-menu";
import { Separator } from "../../components/ui/separator";
import { Textarea } from "../../components/ui/textarea";

export const Wireframe = (): JSX.Element => {
  // Donation data
  const donations = [
    {
      title: "Donation 1",
      description: "(What is Included, a small Description will go here)",
    },
    {
      title: "Donation 2",
      description: "(What is Included, a small Description will go here)",
    },
    {
      title: "Donation 3",
      description: "(What is Included, a small Description will go here)",
    },
    {
      title: "Custom Donation",
      description: "(What is Included, a small Description will go here)",
    },
  ];

  // Stats data
  const stats = [
    { value: "100k +", label: "Lorem ipsum dolor" },
    { value: "100k +", label: "Lorem ipsum dolor" },
    { value: "100k +", label: "Lorem ipsum dolor" },
    { value: "100k +", label: "Lorem ipsum dolor" },
  ];

  // Upcoming Seva data
  const upcomingSevas = [
    {
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "01 Jul 25",
      time: "07: 00 AM",
    },
    {
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "01 Jul 25",
      time: "07: 00 AM",
    },
    {
      title: "Lorem Ipsum",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      date: "01 Jul 25",
      time: "07: 00 AM",
    },
  ];

  // Blog articles data
  const blogArticles = [
    {
      date: "",
      title: "",
    },
    {
      date: "",
      title: "",
    },
    {
      date: "",
      title: "",
    },
  ];

  // Service cards data
  const serviceCards = [
    {
      title: "",
      description:
        "",
    },
    {
      title: "Lorem ipsum dolor sit amet, consectetur",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
    {
      title: "Lorem ipsum dolor sit amet, consectetur",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
    },
  ];

  return (
    <div className="bg-white flex flex-row justify-center w-full">
      <div className="bg-white overflow-hidden w-[1440px] relative">
        {/* Header Section */}
        <header className="relative w-[1283px] h-[114px] mx-auto mt-[77px]">
          <div className="flex w-full h-[114px] items-center gap-[89px]">
            <img
              className="relative w-[114px] h-[114px] object-cover"
              alt="Temple Logo"
              src="/temp-logo.png"
            />

            <div className="flex-col w-[853px] gap-8 flex items-center relative">
              <div className="flex items-center gap-[23px] relative self-stretch w-full flex-[0_0_auto]">
                <h1 className="relative w-fit mt-[-2.00px] ml-[-1.00px] mr-[-9.00px] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#8b0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-[#4c291e] text-4xl tracking-[0] leading-[normal]">
                  Shree Mahakaleshwar Salasar Hanuman Sewa Trust
                </h1>
              </div>

              <NavigationMenu>
                <NavigationMenuList className="inline-flex items-center gap-[30px] relative flex-[0_0_auto]">
                  <NavigationMenuItem>
                    <Button
                      variant="link"
                      className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#333333] text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                    >
                      Home
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="link"
                      className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#333333] text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                    >
                      About
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="inline-flex items-center relative flex-[0_0_auto] bg-transparent hover:bg-transparent [font-family:'Tenor_Sans',Helvetica] font-normal text-[#333333] text-xl tracking-[0] leading-[normal] whitespace-nowrap">
                      Puja&apos;s
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="p-4 w-[200px]">
                        <ul className="space-y-2">
                          <li>Puja 1</li>
                          <li>Puja 2</li>
                          <li>Puja 3</li>
                        </ul>
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="link"
                      className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#333333] text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                    >
                      Membership
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="link"
                      className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#333333] text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                    >
                      Blogs
                    </Button>
                  </NavigationMenuItem>
                  <NavigationMenuItem>
                    <Button
                      variant="link"
                      className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#333333] text-xl tracking-[0] leading-[normal] whitespace-nowrap"
                    >
                      Contact us
                    </Button>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>

            <Button className="w-[137.53px] h-[37px] bg-[#8b0000] rounded-none">
              <span className="[font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                Register/Login
              </span>
            </Button>
          </div>

          <div className="absolute w-[878px] h-[13px] top-[60px] left-48">
            <img
              className="absolute w-[878px] h-[11px] top-[3px] left-0"
              alt="Line"
              src="/line.png"
            />
            <div className="absolute w-[13px] h-[13px] top-0 left-[443px] bg-[#d05e2d] rounded-[6.5px]" />
            <div className="absolute w-[9px] h-[9px] top-[3px] left-[459px] bg-[#d05e2d] rounded-[4.55px]" />
            <div className="absolute w-[9px] h-[9px] top-[3px] left-[432px] bg-[#d05e2d] rounded-[4.55px]" />
            <div className="absolute w-1.5 h-1.5 top-1 left-[469px] bg-[#d05e2d] rounded-[3.25px]" />
            <div className="absolute w-1.5 h-1.5 top-1 left-[422px] bg-[#d05e2d] rounded-[3.25px]" />
          </div>
        </header>

        {/* Hero Section */}
        <section className="relative w-[1283px] h-[741px] mx-auto mt-[31px]">
          <div className="relative h-[741px]">
            <div className="absolute w-[433px] h-[740px] top-0 left-[847px] bg-[#8b0000]" />
            <img
              className="absolute w-[1198px] h-[957px] top-[-216px] left-[42px]"
              alt="Abstract floral"
              src="/abstract-floral.png"
            />
            <img
              className="absolute w-[847px] h-[741px] top-0 left-0 object-cover"
              alt="Temple Image"
              src="/temp-image.png"
            />
            <img
              className="absolute w-[521px] h-[520px] top-[95px] left-[599px] object-cover"
              alt="Deity Image"
              src="/deity.png"
            />

            <div className="absolute w-[442px] h-[289px] top-[262px] left-[75px]">
              <div className="absolute w-[442px] h-[294px] top-0 left-0">
                <div className="absolute w-[442px] -top-px left-0 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                  Feel Lord Shiva&apos;s Power
                </div>
                <h2 className="absolute w-[489px] top-[26px] -left-0.5 [-webkit-text-stroke:2px_#daa520] [font-family:'Marcellus',Helvetica] font-normal text-white text-[64px] tracking-[0] leading-[normal]">
                  JAI SHRI MAHAKAL
                </h2>
                <p className="absolute w-[442px] top-[198px] left-0 [font-family:'Tenor_Sans',Helvetica] text-white text-base leading-[normal] font-normal tracking-[0]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat.
                </p>
              </div>
              <Button className="flex w-[138px] h-[37px] justify-center gap-[6.98px] px-[18.15px] py-[10.47px] top-[305px] left-0 bg-[#daa520] items-center absolute rounded-none">
                <span className="relative w-fit mt-[-1.17px] ml-[-0.89px] [-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                  Register/Login
                </span>
              </Button>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="relative w-[1446px] h-[782px] mt-[195px] mx-auto bg-[url(/rectangle-10.svg)] bg-[100%_100%]">
          <div className="flex">
            <div className="flex-shrink-0">
              <img
                className="w-[380px] h-[558px] mt-[119px] ml-[83px] object-cover"
                alt="Temple Image"
                src="/temp-image-4.png"
              />
              <div className="flex gap-4">
                <img
                  className="w-[305px] h-[251px] -mt-[534px] ml-[481px] object-cover"
                  alt="Temple Image"
                  src="/temp-image-3.png"
                />
                <img
                  className="w-[303px] h-[323px] mt-[374px] -ml-[305px] object-cover"
                  alt="Temple Image"
                  src="/temp-image-2.png"
                />
              </div>
            </div>

            <div className="ml-[58px] mt-[101px]">
              <Card className="w-[523px] h-[563px] border-none shadow-none bg-transparent">
                <CardContent className="p-0">
                  <div className="w-[506px]">
                    <h3 className="w-[506px] -mt-[25px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-4xl leading-[normal] font-normal tracking-[0]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing eli
                    </h3>

                    <div className="flex flex-col w-[542px] items-start gap-2.5 p-2.5 -ml-2.5 mt-[77px]">
                      <img
                        className="relative self-stretch w-full h-0.5 mt-[-2.00px]"
                        alt="Line"
                        src="/line-2.png"
                      />
                    </div>

                    <p className="w-[506px] mt-[28px] [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua. Ut enim ad minim veniam, quis nostrud exercitation
                      ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>

                    <div className="inline-flex items-center gap-[29px] mt-[60px]">
                      <img
                        className="w-[50px] h-[50px] object-cover"
                        alt="Image"
                        src="/image-2-1.png"
                      />
                      <div className="flex flex-col w-[389px] items-start gap-[5px]">
                        <h4 className="self-stretch mt-[-1.00px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-base tracking-[0] leading-[normal]">
                          Lorem Ipsum
                        </h4>
                        <p className="self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-xs font-normal tracking-[0] leading-[normal]">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    </div>

                    <div className="inline-flex items-center gap-[29px] mt-[54px]">
                      <img
                        className="w-[50px] h-[50px] object-cover"
                        alt="Image"
                        src="/image-3-1.png"
                      />
                      <div className="flex flex-col w-[389px] items-start gap-[7px]">
                        <h4 className="self-stretch mt-[-1.00px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-base tracking-[0] leading-[normal]">
                          Lorem Ipsum
                        </h4>
                        <p className="self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-xs font-normal tracking-[0] leading-[normal]">
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua.
                        </p>
                      </div>
                    </div>

                    <Button className="w-[138px] h-[37px] mt-[52px] bg-[#8b0000] rounded-none">
                      <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                        Aarti Timings
                      </span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="absolute w-[26px] h-2.5 top-[81px] left-[497px] ml-[841px]">
                <div className="absolute w-2.5 h-2.5 top-0 left-0 bg-[#d05e2d] rounded-[5px]" />
                <div className="absolute w-[7px] h-[7px] top-0.5 left-3 bg-[#d05e2d] rounded-[3.5px]" />
                <div className="absolute w-[5px] h-[5px] top-0.5 left-[21px] bg-[#d05e2d] rounded-[2.5px]" />
              </div>
            </div>
          </div>
        </section>

        {/* Live Darshan Section */}
        <section className="relative w-[1446px] h-[927px] mt-[5px] bg-[#8b0000]">
          <img
            className="w-[405px] h-[715px] top-[172px] left-14 absolute object-cover"
            alt="Decorative Image"
            src="/mand-7.png"
          />
          <img
            className="w-[354px] h-[715px] top-[172px] left-[1142px] absolute object-cover"
            alt="Decorative Image"
            src="/mand-7.png"
          />

          <div className="absolute w-[225px] h-[225px] top-[393px] left-[1314px]">
            <img
              className="absolute w-[168px] h-[211px] top-[7px] left-3.5"
              alt="Decorative Group"
              src="/om-1.png"
            />
          </div>

          <div className="absolute w-[225px] h-[225px] top-[403px] left-0">
            <img
              className="absolute w-[155px] h-[211px] top-[7px] left-14"
              alt="Decorative Group"
              src="/om-1.png"
            />
          </div>

          <h2 className="absolute w-[210px] top-[42px] left-[674px] [text-shadow:0px_4px_4px_#00000040] [-webkit-text-stroke:0.5px_#8b0000] [font-family:'Marcellus',Helvetica] font-normal text-white text-4xl tracking-[0] leading-[normal]">
            Live Darshan
          </h2>

          <img
            className="absolute w-[314px] h-1.5 top-[102px] left-[619px] object-cover"
            alt="Line"
            src="/line-2.png"
          />

          <div className="absolute w-2.5 h-2.5 top-[99px] left-[774px] bg-white rounded-[5px] border border-solid" />
          <div className="absolute w-[7px] h-[7px] top-[101px] left-[786px] bg-white rounded-[3.5px] border border-solid" />
          <div className="absolute w-[7px] h-[7px] top-[101px] left-[765px] bg-white rounded-[3.5px] border border-solid" />
          <div className="absolute w-[5px] h-[5px] top-[102px] left-[794px] bg-white rounded-[2.5px] border border-solid" />
          <div className="absolute w-[5px] h-[5px] top-[102px] left-[758px] bg-white rounded-[2.5px] border border-solid" />

          <div className="absolute w-[955px] h-[589px] top-[235px] left-[136px] bg-[#1e1e1e]">
            {/* Video player placeholder */}
            <img
              className="w-[305px] h-[305px] top-[-134px] left-[488px] absolute object-cover"
              alt="Decorative Image"
              src="/mand-8-min 2.png"
            />
            <img
              className="w-[305px] h-[305px] top-[366px] left-[495px] absolute object-cover"
              alt="Decorative Image"
              src="/mand-8-min 2.png"
            />
          </div>

          <Badge className="flex flex-col w-[78px] h-[37px] items-start gap-2.5 px-[11px] py-1.5 absolute top-64 left-[991px] bg-[#8b0000] rounded-[10px] border border-solid border-white shadow-[0px_4px_4px_#00000040]">
            <div className="inline-flex items-start gap-[3px]">
              <div className="relative w-6 h-6">
                <div className="relative w-5 h-[15px] top-[5px] left-0.5 bg-[url(/ic-fluent-live-24-filled.png)] bg-[100%_100%]" />
              </div>
              <span className="relative w-fit mt-[-1.00px] [font-family:'Marcellus',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                Live
              </span>
            </div>
          </Badge>

          <div className="flex w-9 h-9 items-center gap-2.5 px-2.5 py-[9px] absolute top-[778px] left-[1044px] bg-[#0000001a] rounded-[18px]">
            <img
              className="relative w-4 h-4"
              alt="Volume max"
              src="/volume-max-svgrepo-com.svg"
            />
          </div>

          <div className="inline-flex items-center justify-center gap-2.5 p-2.5 absolute top-36 left-[469px] bg-[#daa520] border border-solid border-white">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              Shree Mahakaleshwar Mandir
            </div>
          </div>

          <div className="flex w-[304px] items-center justify-center gap-2.5 p-2.5 absolute top-36 left-[784px] bg-[#8b0000] border border-solid border-white">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal] whitespace-nowrap">
              Shree Salasar Balaji Mandir
            </div>
          </div>

          {/* Upcoming Sevas Card */}
          <Card className="absolute w-[290px] h-[514px] top-[248px] left-[1111px] bg-white rounded-none">
            <CardHeader className="pb-0">
              <CardTitle className="w-[180px] [font-family:'Marcellus',Helvetica] font-normal text-[#8b0000] text-2xl tracking-[0] leading-[normal]">
                Upcoming Seva&apos;s
              </CardTitle>
              <div className="absolute w-[31px] h-[31px] top-[17px] left-[225px]">
                <img
                  className="absolute w-[27px] h-[29px] top-px left-0.5"
                  alt="Group"
                  src="/om.png"
                />
              </div>
            </CardHeader>
            <CardContent className="pt-2">
              <img
                className="w-[270px] h-1.5 -mt-1 -ml-1 object-cover"
                alt="Line"
                src="/line.png"
              />

              <img
                className="w-[217px] h-[217px] mt-[132px] ml-[22px] absolute object-cover"
                alt="Decorative Image"
                src="/mand-8-min 2.png"
              />

              {upcomingSevas.map((seva, index) => (
                <div
                  key={index}
                  className="flex flex-col w-[264px] items-start gap-[9px] mt-4"
                >
                  <h4 className="self-stretch mt-[-1.00px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-base tracking-[0] leading-[normal]">
                    {seva.title}
                  </h4>
                  <p className="self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-[10px] leading-[normal] font-normal tracking-[0]">
                    {seva.description}
                  </p>
                  <div className="inline-flex items-center gap-[3px]">
                    <div className="inline-flex items-center gap-[5px]">
                      <img
                        className="w-2 h-2"
                        alt="Calendar icon"
                        src="/calender-svgrepo-com.svg"
                      />
                      <div className="w-[54px] mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#1e1e1e80] text-[10px] tracking-[0] leading-[normal]">
                        {seva.date}
                      </div>
                    </div>
                    <div className="inline-flex items-center gap-0.5">
                      <img
                        className="w-2 h-2"
                        alt="Time icon"
                        src="/time-svgrepo-com.svg"
                      />
                      <div className="w-[54px] mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#1e1e1e80] text-[10px] tracking-[0] leading-[normal]">
                        {seva.time}
                      </div>
                    </div>
                  </div>
                  <Separator className="self-stretch w-full h-px" />
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="inline-flex gap-[19px] px-3 py-[13px] top-[783px] left-[1111px] bg-[#daa520] border border-solid border-white items-center absolute">
            <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-[#8b0000] text-xs tracking-[0] leading-[normal] whitespace-nowrap">
              Countdown Ends in:
            </div>
            <div className="relative w-fit mt-[-1.50px] [-webkit-text-stroke:0.5px_#8b0000] [font-family:'Tenor_Sans',Helvetica] text-[#8b0000] text-2xl tracking-[4.56px] whitespace-nowrap font-normal leading-[normal]">
              00:00:00
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="relative w-[1440px] h-[961px] mt-[40px] bg-[#ece5df]">
          <img
            className="w-[962px] h-[961px] top-0 left-[239px] absolute object-cover"
            alt="Decorative Image"
            src="/mand-7.png"
          />
          <div className="flex flex-col w-[1069px] items-center gap-[60px] absolute top-[88px] left-[203px]">
            <div className="flex flex-col w-[695px] items-center gap-1.5 relative flex-[0_0_auto]">
              <div className="relative self-stretch mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] text-base text-center font-normal text-[#4c291e] tracking-[0] leading-[normal]">
                Lorem Ipsum odor
              </div>
              <div className="relative self-stretch [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-4xl text-center tracking-[0] leading-[normal]">
                Lorem ipsum dolor sit amet, consectetur
              </div>
              <div className="relative w-[308px] h-2.5">
                <div className="relative w-[314px] h-2.5 left-[-3px]">
                  <img
                    className="absolute w-[314px] h-1.5 top-[3px] left-0 object-cover"
                    alt="Line"
                    src="/line.png"
                  />
                  <div className="left-[155px] bg-[#8b0000] absolute w-2.5 h-2.5 top-0 rounded-[5px] border border-solid" />
                  <div className="left-[167px] bg-[#8b0000] absolute w-[7px] h-[7px] top-0.5 rounded-[3.5px] border border-solid" />
                  <div className="left-[146px] bg-[#8b0000] absolute w-[7px] h-[7px] top-0.5 rounded-[3.5px] border border-solid" />
                  <div className="absolute w-[5px] h-[5px] top-[3px] left-[175px] bg-[#8b0000] rounded-[2.5px] border border-solid" />
                  <div className="absolute w-[5px] h-[5px] top-[3px] left-[139px] bg-[#8b0000] rounded-[2.5px] border border-solid" />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-[27px] relative self-stretch w-full flex-[0_0_auto]">
              <div className="gap-[22px] self-stretch w-full flex-[0_0_auto] flex items-center relative">
                <img
                  className="relative w-[338px] h-[316px] object-cover"
                  alt="Temple Image"
                  src="/temp-image-7.png"
                />
                <Card className="flex flex-col w-[349px] h-[316px] items-center justify-center gap-[27px] px-[33px] py-[52px] relative bg-white rounded-none">
                  <CardContent className="p-0 flex flex-col items-center">
                    <img
                      className="relative w-[60px] h-[60px]"
                      alt="Om symbol"
                      src="/om.png"
                    />
                    <h3 className="relative w-[282px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-xl text-center tracking-[0] leading-[normal] mt-6">
                      Lorem ipsum dolor sit amet, consectetur
                    </h3>
                    <p className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-[10px] text-center leading-[normal] font-normal tracking-[0] mt-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </CardContent>
                </Card>
                <img
                  className="relative w-[338px] h-[316px] object-cover"
                  alt="Temple Image"
                  src="/temp-image-6.png"
                />
              </div>

              <div className="gap-[22px] self-stretch w-full flex-[0_0_auto] flex items-center relative">
                <Card className="flex flex-col w-[338px] h-[316px] items-center justify-center gap-[26px] px-7 py-[43px] relative bg-white rounded-none">
                  <CardContent className="p-0 flex flex-col items-center">
                    <img
                      className="relative w-[60px] h-[60px]"
                      alt="Om symbol"
                      src="/om.png"
                    />
                    <h3 className="relative w-[282px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-xl text-center tracking-[0] leading-[normal] mt-6">
                      Lorem ipsum dolor sit amet, consectetur
                    </h3>
                    <p className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-[10px] text-center leading-[normal] font-normal tracking-[0] mt-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </CardContent>
                </Card>
                <img
                  className="relative w-[349px] h-[316px] object-cover"
                  alt="Temple Image"
                  src="/temp-image-5.png"
                />
                <Card className="flex flex-col w-[338px] h-[316px] items-center justify-center gap-[26px] px-7 py-[43px] relative bg-white rounded-none">
                  <CardContent className="p-0 flex flex-col items-center">
                    <img
                      className="relative w-[60px] h-[60px]"
                      alt="Om symbol"
                      src="/om.png"
                    />
                    <h3 className="relative w-[282px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-xl text-center tracking-[0] leading-[normal] mt-6">
                      Lorem ipsum dolor sit amet, consectetur
                    </h3>
                    <p className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-[10px] text-center leading-[normal] font-normal tracking-[0] mt-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit,
                      sed do eiusmod tempor incididunt ut labore et dolore magna
                      aliqua.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Divine Power Section */}
        <section
          className="relative w-full flex items-center justify-center mt-[40px] mx-auto"
          style={{
            height: "643px", // adjust as needed
            backgroundImage:
              "linear-gradient(0deg,rgba(0,0,0,0.2),rgba(0,0,0,0.2)),linear-gradient(180deg,rgba(0,0,0,0),rgba(139,0,0,0.75)),url('/divine-2.png')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-30" />
          <div className="relative flex flex-col items-center w-full z-10">
            <h2 className="mt-[220px] [font-family:'Marcellus',Helvetica] font-normal text-white text-5xl text-center tracking-[0] leading-[normal] drop-shadow-lg">
              Feel the Surreal Divine Power
            </h2>
            <p className="mt-9 w-[70%] max-w-3xl [font-family:'Tenor_Sans',Helvetica] text-white text-base text-center leading-[1.6] font-normal tracking-[0] drop-shadow">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Lorem ipsum dolor sit amet,
              consectetur adipiscing elit, sed do eiusmod tempor incididunt ut
              labore et dolore magna aliqua. Ut enim ad minim veniam, quis
              nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
              consequat.
            </p>
          </div>
        </section>
// Add this just below the Divine Power Section

<section className="flex gap-[20px] mt-[40px] mx-[80px]">
  {/* Connect with Us */}
  <Card className="w-[413px] h-[188px] bg-[#8b0000] rounded-none">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <img
          className="w-8 h-8 mb-2"
          alt="Temple Icon"
          src="/temple-icon.svg"
        />
        <div className="[font-family:'Marcellus',Helvetica] font-normal text-white text-xl mb-2">
          Connect with Us
        </div>
        <div className="[font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base mb-4">
          Reach out and connect with our church community. We're here to welcome, assist, and share in your journey of faith.
        </div>
      </div>
      <div className="flex items-center text-white text-lg mt-2">
        <img className="w-6 h-6 mr-2" alt="Phone" src="/phone.svg" />
        +91 9876543210
      </div>
    </CardContent>
  </Card>

  {/* Donate for Cause */}
  <Card className="w-[413px] h-[188px] bg-[#ece5df] rounded-none">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <img
          className="w-8 h-8 mb-2"
          alt="Charity Icon"
          src="/charity-svgrepo-com.svg"
        />
        <div className="[font-family:'Marcellus',Helvetica] font-normal text-black text-xl mb-2">
          Donate for Cause
        </div>
        <div className="[font-family:'Tenor_Sans',Helvetica] font-normal text-black text-base mb-4">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliq
        </div>
      </div>
      <Button className="w-20 h-[30px] bg-[#8b0000] rounded-none text-white text-sm">
        Donate
      </Button>
    </CardContent>
  </Card>

  {/* Office Timings */}
  <Card className="w-[413px] h-[188px] bg-[#d05e2d] rounded-none">
    <CardContent className="p-6 flex flex-col justify-between h-full">
      <div>
        <img
          className="w-8 h-8 mb-2"
          alt="Time Icon"
          src="/time-svgrepo-com-3.svg"
        />
        <div className="[font-family:'Marcellus',Helvetica] font-normal text-white text-xl mb-2">
          Office Timings
        </div>
        <div className="flex justify-between [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base">
          <div>
            <div>Monday - Friday</div>
            <div>Saturday - Sunday</div>
          </div>
          <div className="text-right">
            <div>8:00 AM - 8:00 PM</div>
            <div>10:00 AM - 6:00 PM</div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
</section>
        {/* Donation Section */}
        <section className="relative w-[1440px] h-[1576px] mt-[40px]">
          <img
            className="absolute w-[810px] h-[810px] top-0 left-0 object-cover"
            alt="Decorative Image"
            src="/mand-9-min 1.png"
          />

          <div className="absolute w-[1440px] h-[1424px] top-[69px] left-0 bg-[#f4f0ec]" />

          <div className="absolute w-[630px] top-[137px] left-[657px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-4xl leading-[normal] font-normal tracking-[0]">
            Lorem ipsum dolor sit amet, consectetur adipiscing eli
          </div>

          <div className="absolute w-[368px] top-[145px] left-[188px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-xl leading-[normal] font-normal tracking-[0]">
            Lorem ipsum dolor sit amet, consectetur adipiscing eli
          </div>

          <img
            className="absolute w-[542px] h-5 top-[239px] left-[647px]"
            alt="Decorative Line"
            src="/Frame 24.png"
          />

          <div className="flex flex-col space-y-6 absolute top-[231px] left-[183px]">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-[197px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-5xl tracking-[0] leading-[normal]">
                  {stat.value}
                </div>
                <div className="w-[197px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-xl font-normal tracking-[0] leading-[normal]">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col space-y-4 absolute top-[277px] left-[657px]">
            <img
              className="w-[305px] h-[272px] object-cover"
              alt="Image"
              src="/image-4.png"
            />
            <div className="w-[378px] [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat. Lorem ipsum dolor sit
              amet, consectetur adipiscing elit,
            </div>
            <div className="flex flex-col w-[222px] items-start gap-[15px] mt-[25px]">
              <Separator className="relative self-stretch w-full h-px mt-[-1.00px]" />
              <div className="relative w-[186px] [font-family:'Marcellus',Helvetica] font-normal text-[#8b0000] text-xl tracking-[0] leading-[normal]">
                John Doe
              </div>
            </div>
            <Button className="w-24 h-[30px] mt-[64px] bg-[#8b0000] rounded-none">
              <span className="relative w-fit mt-[-4.17px] mb-[-2.77px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                Know More
              </span>
            </Button>
          </div>

          <div className="absolute w-[30px] h-[30px] top-[508px] left-[1330px] bg-white" />
          <div className="absolute w-[30px] h-[30px] top-[508px] left-[1293px] bg-[#8b0000]" />
          <img
            className="left-[1335px] absolute w-[21px] h-[15px] top-[516px]"
            alt="Arrow"
            src="/arrow-1.svg"
          />
          <img
            className="left-[1298px] absolute w-[21px] h-[15px] top-[516px]"
            alt="Arrow"
            src="/arrow-2.svg"
          />

          <img
            className="absolute w-[785px] h-[810px] top-[623px] left-0 object-cover"
            alt="Decorative Image"
            src="/mand-9-min 1.png"
          />

          <img
            className="absolute w-[1366px] h-[569px] top-[924px] left-[27px] object-cover"
            alt="Image"
            src="/image-5.png"
          />

          <div className="absolute w-[1116px] h-[273px] top-[768px] left-[38px] bg-[#8b0000]">
            <img
              className="absolute w-[84px] h-[92px] top-0 left-0"
              alt="Decorative Image"
              src="/mand-9-min-2.png"
            />
            <img
              className="absolute w-[145px] h-[145px] top-[117px] left-[426px]"
              alt="Decorative Image"
              src="/mand-9-min-3.png"
            />

            <div className="absolute w-[414px] top-[53px] left-[149px] [-webkit-text-stroke:1px_#daa520] [font-family:'Marcellus',Helvetica] text-white text-4xl leading-[normal] font-normal tracking-[0]">
              Lorem ipsum dolor sit amet, consectetur adipiscing eli
            </div>

            <div className="flex flex-col space-y-4 absolute top-[34px] left-[582px]">
              {donations.map((donation, index) => (
                <div
                  key={index}
                  className="flex w-[479px] items-center justify-between"
                >
                  <div className="flex flex-col w-[322px] items-start gap-[3px]">
                    <div className="relative self-stretch mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                      {donation.title}
                    </div>
                    <div className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] font-normal text-[#ffffff80] text-xs tracking-[0] leading-[normal]">
                      {donation.description}
                    </div>
                  </div>
                  <Button className="w-24 h-[30px] bg-white rounded-none">
                    <span className="relative w-fit mt-[-4.17px] mb-[-2.77px] [font-family:'Tenor_Sans',Helvetica] font-normal text-[#8b0000] text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                      Donate
                    </span>
                  </Button>
                  {index < donations.length - 1 && (
                    <img
                      className="absolute w-[479px] h-px top-[57px] left-[620px] object-cover"
                      alt="Line"
                      src="/line-9.svg"
                      style={{ transform: `translateY(${index * 58}px)` }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="absolute w-[771px] h-[167px] top-[1406px] left-[622px] bg-[#d05e2d]">
            <img
              className="absolute w-[84px] h-[92px] top-0 left-0"
              alt="Decorative Image"
              src="/mand-9-min-4.png"
            />
            <img
              className="absolute w-[84px] h-[92px] top-[78px] left-[687px]"
              alt="Decorative Image"
              src="/mand-9-min-5.png"
            />

            <div className="flex justify-around items-center h-full">
              {Array(3)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <Avatar className="w-[74px] h-[74px] bg-[#8b000080] rounded-[37px] border border-solid border-white" />
                    <div className="w-[153px] mt-5 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] text-center">
                      Lorem Ispum Dolor
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </section>

        {/* Grid Layout Section */}
        <section className="relative w-[1440px] h-[681px] mt-[40px]">
          <div className="grid grid-cols-4 grid-rows-2 h-full">
            <div className="col-span-2 row-span-1 bg-[#f4f0ec]">
              <div className="flex flex-col w-[596px] items-start gap-[21px] relative top-[66px] left-[81px]">
                <h3 className="relative w-[506px] mt-[-1.00px] [font-family:'Marcellus',Helvetica] text-[#4c291e] text-4xl leading-[normal] font-normal tracking-[0]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing eli
                </h3>
                <p className="relative self-stretch [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                </p>
                <Button className="w-[137.53px] h-[37px] bg-[#8b0000] rounded-none">
                  <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                    CTA Button
                  </span>
                </Button>
              </div>
            </div>
            <div className="col-span-1 row-span-1 bg-[#8b0000]">
              <img
                className="w-[303px] h-[323px] mt-2 ml-7"
                alt="Image"
                src="/temp-image-11.png"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                className="w-full h-full object-cover"
                alt="Image"
                src="/temp-image-10.png"
              />
            </div>
            <div className="col-span-1 row-span-1">
              <img
                className="w-full h-full object-cover"
                alt="Image"
                src="/temp-image-8.png"
              />
            </div>
            <div className="col-span-1 row-span-1 bg-white">
              <img
                className="w-[303px] h-[323px] mt-2 ml-[25px] object-cover"
                alt="Image"
                src="/temp-image-2.png"
              />
            </div>
            <div className="col-span-2 row-span-1">
              <img
                className="w-full h-full object-cover"
                alt="Image"
                src="/temp-image-9.png"
              />
            </div>
          </div>
        </section>

        {/* Om Namah Shivaya Section */}
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

        {/* Scrolling Banner */}
        <div className="flex w-[1440px] h-[82px] items-center gap-[26px] px-20 py-[15px] mt-[5px] bg-[#8b0000]">
          <div className="flex items-center gap-[26px] animate-marquee">
            <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
              || JAI SHREE MAHAKALESHWAR ||
            </div>
            <img
              className="relative w-[41px] h-[41px]"
              alt="Om symbol"
              src="/om.png"
            />
            <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
              || JAI SHREE SALASAR BALAJI ||
            </div>
            <img
              className="relative w-[41px] h-[41px]"
              alt="Om symbol"
              src="/om-solid-svgrepo-com.svg"
            />
            <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
              || JAI SHREE MAHAKALESHWAR ||
            </div>
            <img
              className="relative w-[41px] h-[41px]"
              alt="Om symbol"
              src="/om-solid-svgrepo-com.svg"
            />
            <div className="relative w-fit [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
              || JAI SHREE SALASAR BALAJI ||
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <section className="flex mt-[40px]">
          <div className="relative w-[602px] h-[845px] bg-[url(/image-7.png)] bg-cover bg-[50%_50%]">
            <Card className="absolute w-[478px] h-[636px] top-[97px] left-[62px] bg-[#ece5df] rounded-none">
              <CardContent className="p-0">
                <div className="flex flex-col w-[430px] items-center mt-[34px] mx-auto">
                  <div className="flex flex-col w-[415px] items-center">
                    <h3 className="relative w-fit mt-[-1.00px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-xl tracking-[0] leading-[normal]">
                      Reach Out to us
                    </h3>
                    <h2 className="relative w-[395px] mt-[10px] [font-family:'Marcellus',Helvetica] font-normal text-[#4c291e] text-4xl tracking-[0] leading-[normal]">
                      We will get Back to You
                    </h2>
                  </div>
                  <p className="self-stretch [font-family:'Tenor_Sans',Helvetica] font-normal text-[#1e1e1e80] text-sm text-center tracking-[0] leading-[normal] mt-2">
                    Your bridge to meaningful communication and personalized
                    assistance, we&#39;re here to listen and assist you
                  </p>
                </div>

                <img
                  className="absolute w-[368px] h-5 top-[166px] left-[65px]"
                  alt="Decorative Line"
                  src="/frame-24.svg"
                />

                <form className="flex flex-col gap-[10px] mt-[149px] mx-[62px]">
                  <div className="flex gap-2">
                    <Input
                      className="w-[200px] p-2.5 bg-white rounded-none"
                      placeholder="First Name"
                    />
                    <Input
                      className="w-[200px] p-2.5 bg-white rounded-none"
                      placeholder="Last Name"
                    />
                  </div>
                  <Input
                    className="w-[410px] p-2.5 bg-white rounded-none"
                    placeholder="Mobile Number"
                  />
                  <Input
                    className="w-[410px] p-2.5 bg-white rounded-none"
                    placeholder="Email ID"
                  />
                  <Textarea
                    className="w-[410px] h-[100px] p-2.5 bg-white rounded-none"
                    placeholder="Message"
                  />
                  <Button className="w-[138px] h-[37px] mt-[52px] mx-auto bg-[#8b0000] rounded-none">
                    <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                      Submit
                    </span>
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          <div className="relative w-[838px] h-[847px] mb-10 -mt-5">
            <img
              className="w-full h-full object-cover"
              alt="Image"
              src="/image-6.png"
            />
            <div className="absolute w-[470px] top-[909px] left-[-521px] [font-family:'Marcellus',Helvetica] text-[#8b0000] text-[40.9px] leading-[normal] font-normal tracking-[0]">
              Lorem ipsum dolor sit amet, consectetur adipiscing eli
            </div>
            <div className="absolute w-[378px] top-[915px] left-0 [font-family:'Tenor_Sans',Helvetica] text-[#1e1e1e80] text-base leading-[normal] font-normal tracking-[0]">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
              enim ad minim veniam, quis nostrud exercitation ullamco laboris
              nisi ut aliquip ex ea commodo consequat.
            </div>
            <Button className="absolute w-[138px] top-[950px] left-[526px] bg-[#8b0000] rounded-none">
              <span className="[-webkit-text-stroke:0.5px_#ffffff] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                Read Articles
              </span>
            </Button>
          </div>
        </section>

        {/* Blog Articles Section */}
        <section className="flex gap-[20px] mt-[193px] mx-[80px]">
          {blogArticles.map((article, index) => (
            <Card
              key={index}
              className="w-[413px] h-[276px] bg-[url(/ganesh.png)] bg-cover bg-[50%_50%] rounded-none border-none"
            >
             <CardContent className="relative z-20 flex flex-col justify-end h-full p-6">
        <div className="text-white text-xs mb-1">{article.date || "Jan 01, 2025"}</div>
        <div className="text-[#daa520] text-lg font-semibold mb-3 [font-family:'Marcellus',Helvetica]">
          {article.title || "Lorem ipsum dolor sit"}
        </div>
        <Button className="w-[110px] h-[32px] bg-[#8b0000] rounded-none text-white text-xs">
          Read Articles
        </Button>
      </CardContent>
            </Card>
          ))}
        </section>

        {/* Info Cards Section */}
        <section className="flex gap-[20px] mt-[40px] mx-[80px]">
          {/* <Card className="w-[413px] h-[295px] bg-[#8b0000] rounded-none">
            <CardContent className="p-0">
              <div className="absolute w-[182px] top-[100px] left-[25px] [font-family:'Marcellus',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                Connect with Us
              </div>
              <div className="absolute w-[334px] top-[140px] left-[25px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                Reach out and connect with our church <br />
                community. We&#39;re here to welcome, assist, <br />
                and share in your journey of faith.
              </div>
              <div className="absolute w-[182px] top-[231px] left-[68px] [font-family:'Marcellus',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                +91 9876543210
              </div>
              <div className="absolute w-[33px] h-[33px] top-[229px] left-[25px] bg
              <div className="absolute w-14 h-14 top-[22px] left-[25px]">
                <div className="relative h-[52px] top-0.5 bg-[url(/group-4.png)] bg-[100%_100%]" />
              </div>
            </CardContent>
          </Card> */}

          {/* <Card className="w-[413px] h-[295px] bg-[#ece5df] rounded-none">
            <CardContent className="p-0">
               <div className="absolute w-[212px] top-[98px] left-[31px] [font-family:'Marcellus',Helvetica] font-normal text-black text-2xl tracking-[0] leading-[normal]">
                Donate for Cause
              </div>
              <div className="absolute w-[334px] top-[138px] left-[31px] [font-family:'Tenor_Sans',Helvetica] text-black text-base leading-[normal] font-normal tracking-[0]">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                eiusmod tempor incididunt ut labore et dolore magna aliq
              </div> 
              <img
                className="absolute w-[52px] h-[52px] top-[25px] left-[25px]"
                alt="Charity icon"
                src="/charity-svgrepo-com.svg"
              />
               <Button className="w-24 h-[30px] absolute top-[214px] left-[31px] bg-[#8b0000] rounded-none">
                <span className="relative w-fit mt-[-4.17px] mb-[-2.77px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-sm tracking-[0] leading-[normal] whitespace-nowrap">
                  Donate
                </span>
              </Button> 
            </CardContent>
          </Card> */}

          {/* <Card className="w-[413px] h-[295px] bg-[#d05e2d] rounded-none">
            <CardContent className="p-0">
              <div className="absolute w-[182px] top-[100px] left-7 [font-family:'Marcellus',Helvetica] font-normal text-white text-2xl tracking-[0] leading-[normal]">
                Office Timings
              </div>
              <div className="absolute w-[132px] top-[152px] left-7 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                Monday - Friday
              </div>
              <div className="absolute w-[155px] top-[193px] left-7 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                Saturday - Sunday
              </div>
              <div className="absolute w-[148px] top-[152px] left-[247px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                8:00 AM - 8:00 PM
              </div>
              <div className="absolute w-[156px] top-[193px] left-[243px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
                10:00 AM - 6:00 PM
              </div>
              <img
                className="absolute w-[47px] h-[47px] top-[35px] left-[31px]"
                alt="Time icon"
                src="/time-svgrepo-com-3.svg"
              />
            </CardContent>
          </Card> */}
        </section>

        {/* Footer */}
        <footer className="relative w-[1440px] h-[595px] mt-[40px] bg-[#8b0000]">
          <div className="absolute w-[643px] h-[203px] top-6 left-[400px]">
            <div className="absolute w-[114px] h-[114px] top-0 left-[263px]">
              <div className="relative h-[114px]">
                <div className="absolute w-[100px] h-[100px] top-[7px] left-[7px] bg-white rounded-[50px]" />
                <img
                  className="absolute w-[114px] h-[114px] top-0 left-0 object-cover"
                  alt="Temple Logo"
                  src="/temp-logo.png"
                />
              </div>
            </div>
            <div className="absolute w-[643px] top-[113px] left-0 [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-white text-4xl text-center tracking-[0] leading-[normal]">
              Shree Mahakaleshwar Salasar Hanuman Sewa Trust
               <img src="/footer-line.png"/>
            </div>
           
          </div>

          <div className="absolute w-[614px] top-[253px] left-[413px] [font-family:'Tenor_Sans',Helvetica] text-white text-base text-center leading-[normal] font-normal tracking-[0]">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </div>

          <div className="absolute w-[604px] h-5 top-[231px] left-[418px]">
            <div className="relative w-[596px] h-3 top-1 left-1 bg-[url(/line-2.svg)] bg-[100%_100%]">
              {/* <div className="relative w-[41px] h-2.5 top-px left-[277px]">
                <div className="left-4 bg-[#d05e2d] absolute w-2.5 h-2.5 top-0 rounded-[5px] border border-solid" />
                <div className="left-7 bg-[#d05e2d] absolute w-[7px] h-[7px] top-0.5 rounded-[3.5px] border border-solid" />
                <div className="left-[7px] bg-[#d05e2d] absolute w-[7px] h-[7px] top-0.5 rounded-[3.5px] border border-solid" />
                <div className="absolute w-[5px] h-[5px] top-[3px] left-9 bg-[#d05e2d] rounded-[2.5px] border border-solid" />
                <div className="absolute w-[5px] h-[5px] top-[3px] left-0 bg-[#d05e2d] rounded-[2.5px] border border-solid" />
              </div> */}
            </div>
          </div>

          <div className="absolute w-[156px] top-[93px] left-20 [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-white text-xl tracking-[0] leading-[normal]">
            Special Links
          </div>

          <div className="flex flex-col space-y-8 absolute top-[132px] left-[81px]">
            <div className="w-[203px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              Link 1
            </div>
            <div className="w-[182px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              Link 2
            </div>
            <div className="w-[203px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              Link 3
            </div>
            <div className="w-[182px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              Link 4
            </div>
            <div className="w-[203px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal]">
              Link 5
            </div>
          </div>

          <div className="absolute w-[222px] h-[159px] top-[87px] left-[1147px]">
            <div className="absolute w-[105px] -top-px left-[108px] [text-shadow:0px_4px_4px_#daa52040] [-webkit-text-stroke:1px_#9a0000] [font-family:'Marcellus_SC',Helvetica] font-normal text-white text-xl text-right tracking-[0] leading-[normal]">
              Info
            </div>
            <div className="absolute w-[203px] top-[38px] left-[11px] text-white text-base text-center [font-family:'Tenor_Sans',Helvetica] font-normal tracking-[0] leading-[normal]">
              Email: info@support.com
            </div>
            <div className="absolute w-[182px] top-[70px] left-8 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base text-center tracking-[0] leading-[normal]">
              Phone No: 9876543210
            </div>
            <div className="absolute w-[214px] top-[102px] left-0 [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base text-right tracking-[0] leading-[normal]">
              Address : 1080 Brickell Ave, Miami ( Florida )<br />
              United States
            </div>
          </div>

          <div className="absolute w-[132px] h-5 top-[353px] left-[657px]">
            <div className="relative h-5">
              <div className="absolute w-5 h-5 top-0 left-0 bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
              <div className="absolute w-5 h-5 top-0 left-[27px] bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
              <div className="absolute w-5 h-5 top-0 left-[54px] bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
              <div className="absolute w-5 h-5 top-0 left-[82px] bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
              <div className="absolute w-5 h-5 top-0 left-28 bg-white rounded-[10.24px] border-[0.5px] border-solid border-[#8b0000]" />
              <div className="absolute w-[123px] h-[13px] top-1 left-1.5">
                <div className="absolute w-2 h-[13px] top-0 left-0">
                  <img
                    className="absolute w-[7px] h-[13px] top-0 left-px"
                    alt="Facebook"
                    src="/facebook.svg"
                  />
                </div>
                <div className="absolute w-[13px] h-2.5 top-px left-[25px]">
                  <img
                    className="absolute w-[13px] h-2.5 top-0 left-px"
                    alt="Twitter"
                    src="/twitter.svg"
                  />
                </div>
                <div className="absolute w-[13px] h-[13px] top-0 left-[52px]">
                  <img
                    className="absolute w-[13px] h-[13px] top-0 left-px"
                    alt="Instagram"
                    src="/instagram.svg"
                  />
                </div>
                <div className="absolute w-[13px] h-[13px] -top-px left-20">
                  <div className="relative h-3 top-px left-px bg-[url(/linkedin.svg)] bg-[100%_100%]" />
                </div>
                <div className="absolute w-[15px] h-2.5 top-px left-[109px]">
                  <div className="relative w-3.5 h-2.5 left-px bg-[url(/youtube.svg)] bg-[100%_100%]" />
                </div>
              </div>
            </div>
          </div>

          <div className="inline-flex items-center gap-[22px] absolute top-[427px] left-[513px]">
            <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Partnerships
            </div>
            <div className="relative w-2.5 h-2.5 bg-[#d05e2d] rounded-[5px]" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Temple Support
            </div>
            <div className="relative w-2.5 h-2.5 bg-[#d05e2d] rounded-[5px]" />
            <div className="relative w-fit mt-[-1.00px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
              Privacy Policy
            </div>
          </div>

          {/* <Separator className="absolute w-[1293px] h-3 top-[487px] left-[74px]" /> */}
         <img src="/footer-line-2.png"className="absolute w-[1293px] h-3 top-[487px] left-[74px]"></img>
          <div className="absolute w-[430px] h-[22px] top-[519px] left-[81px]">
            {/* <img
              className="absolute w-[19px] h-[19px] top-[3px] left-[87px]"
              alt=""
              src="/heart-svgrepo-com.svg"
            /> */}
           <div className="absolute top-0 left-0 flex items-center [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
  Made with
  <span className="mx-2 text-[20px] align-middle">🧡</span>
  by Nexteir Technologies Pvt. Ltd. in India
  <img className="ml-2 w-6 h-4 inline-block align-middle" src="/india.png" alt="India Flag" />
</div>
          </div>

          <div className="absolute top-[519px] left-[981px] [font-family:'Tenor_Sans',Helvetica] font-normal text-white text-base tracking-[0] leading-[normal] whitespace-nowrap">
            All Rights Reserved © 2025 | Terms &amp; Conditions
          </div>

          {/* <div className="absolute w-[26px] h-[26px] top-[517px] left-[521px]">
            <div className="absolute w-[26px] h-1.5 top-4 left-0 bg-[url(/india.png)] bg-[100%_100%]">
              <img
                className="absolute w-[9px] h-1.5 top-0 left-[17px]"
                alt="Vector"
                src="/vector-7.svg"
              />
              <img
                className="absolute w-[26px] h-[3px] top-[3px] left-0"
                alt="Vector"
                src="/vector-5.svg"
              />
            </div>
            <div className="absolute w-[26px] h-1.5 top-1 left-0 bg-[url(/vector-3.svg)] bg-[100%_100%]">
              <img
                className="absolute w-[23px] h-1.5 top-0 left-[3px]"
                alt="Vector"
                src="/vector-8.svg"
              />
              <img
                className="absolute w-[23px] h-1.5 top-0 left-[3px]"
                alt="Vector"
                src="/vector-9.svg"
              />
            </div>
            <div className="absolute w-[26px] h-1.5 top-2.5 left-0 bg-[url(/vector-4.svg)] bg-[100%_100%]">
              <img
                className="absolute w-[17px] h-1.5 top-0 left-[9px]"
                alt="Vector"
                src="/india.png"
              />
              <img
                className="absolute w-1 h-px top-0 left-[22px]"
                alt="Vector"
                src="/vector-1.svg"
              />
              <img
                className="absolute w-[5px] h-[5px] top-0 left-2.5"
                alt="Vector"
                src="/vector-2.svg"
              />
              <img
                className="absolute w-[5px] h-1 top-0 left-[11px]"
                alt="Group"
                src="/group-3.png"
              />
            </div>
          </div> */}
        </footer>
      </div>
    </div>
  );
};
