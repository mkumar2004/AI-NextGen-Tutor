'use client'
import { useUser } from '@stackframe/stack'
import React from 'react'
import Image from 'next/image'
import { BlurFade } from '@/components/ui/blur-fade'
import UserInputDialong from './UserInputDialong'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export const Experlist = [
  {
    name: "Lecture on Topic",
    icon: "/Ass1.svg",
    prompt: "Act as a knowledgeable lecturer. Explain the topic '{user_topic}' in a simple and engaging way using real-world examples, analogies, and visuals when needed."
  },
  {
    name: "Mock Interview",
    icon: "/Ass4.svg",
    prompt: "Conduct a realistic mock interview focused on '{user_topic}'. Ask professional questions, evaluate answers, and provide detailed feedback with improvement suggestions."
  },
  {
    name: "Ques Ans Pre",
    icon: "/Ass3.svg",
    prompt: "Simulate a question-answer preparation session on '{user_topic}'. Ask relevant questions, test understanding, and explain each answer clearly for better learning."
  },
  {
    name: "Language Skill",
    icon: "/Ass2.svg",
    prompt: "Act as a language coach specialized in '{user_topic}'. Help improve grammar, pronunciation, and vocabulary through interactive exercises and real-world examples."
  },
  {
    name: "Medication",
    icon: "/Ass5.svg",
    prompt: "Provide calm, informative guidance about '{user_topic}' in the context of general health and medication awareness. Offer safe advice, wellness tips, and reminders — without giving medical diagnoses."
  },
];

// function FeaturesAssistants({Setroomid, Setmeetingdata}) {
//   const user = useUser();


//   return (
//     <div className="p-4 md:p-6">
//       {/* Header */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-6 gap-3">
//         <div>
//           <h2 className="font-medium text-gray-400 text-sm md:text-base">WorkSpace</h2>
//           <h2 className="text-xl md:text-3xl font-bold truncate">
//             Welcome back, {user?.displayName}
//           </h2>
//         </div>
//         <button className="bg-blue-500 px-4 md:px-6 py-2 rounded-lg text-white text-sm md:text-base self-start md:self-center">
//           Profile
//         </button>
//       </div>

//       {/* Assistants Grid */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
//         {Experlist.map((item, index) => (
//           <BlurFade key={item.icon} delay={0.25 + index * 0.05} inView>
//             <UserInputDialong options={item}  Setroomid={Setroomid} SetData={Setmeetingdata} >
//             <div className="p-4 bg-gray-100 rounded-2xl flex flex-col justify-center items-center shadow hover:shadow-md transition">
//               <Image
//                 src={item.icon}
//                 alt={item.name}
//                 width={200}
//                 height={200}
//                 className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto"
//               />
//               <h2 className="mt-3 text-xs sm:text-sm md:text-base font-medium text-center">
//                 {item.name}
//               </h2>
//             </div>
//             </UserInputDialong >
//           </BlurFade>
//         ))}
//       </div>
//     </div>
//   )
// }

function FeaturesAssistants({ Setroomid, Setmeetingdata }) {
  const user = useUser();
  const router = useRouter();

  const ProfileHander=()=>{
       router.push('dashboard/Profile')
  }
  return (
    <div className="p-4 md:p-6">

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-8 gap-3">
        <div>
          <h2 className="font-medium text-gray-400 text-sm">Workspace</h2>
          <h2 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.displayName}
          </h2>
        </div>

        <button 
         onClick={ProfileHander}
         className="bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-lg text-white text-sm transition">
          Profile
        </button>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6">

        {Experlist.map((item, index) => (
          <BlurFade key={item.icon} delay={0.25 + index * 0.06} inView>

            <UserInputDialong
              options={item}
              Setroomid={Setroomid}
              SetData={Setmeetingdata}
            >
              <div
                className="group p-5 sm:p-6 bg-white border border-gray-200 
          hover:border-blue-500 rounded-2xl shadow-sm 
          hover:shadow-md transition-all duration-200 
          flex flex-col items-center justify-between text-center
          h-44 sm:h-52"
              >

                {/* ICON — FIXED HEIGHT BOX */}
                <div className="flex justify-center items-center h-20 sm:h-24">
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={96}
                    height={96}
                    className="object-contain transition group-hover:scale-110"
                  />
                </div>

                {/* TITLE — FIXED MIN HEIGHT */}
                <h2 className="mt-2 text-sm sm:text-base font-semibold text-gray-800 leading-tight min-h-[32px] flex items-center justify-center">
                  {item.name}
                </h2>

              </div>
            </UserInputDialong>

          </BlurFade>
        ))}

      </div>

    </div>
  );
}

export default FeaturesAssistants
