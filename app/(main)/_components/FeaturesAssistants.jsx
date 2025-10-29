'use client'
import { useUser } from '@stackframe/stack'
import React from 'react'
import Image from 'next/image'
import { BlurFade } from '@/components/ui/blur-fade'
import UserInputDialong from './UserInputDialong'
import { Button } from '@/components/ui/button'

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

function FeaturesAssistants() {
  const user = useUser();


  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center w-full mb-6 gap-3">
        <div>
          <h2 className="font-medium text-gray-400 text-sm md:text-base">WorkSpace</h2>
          <h2 className="text-xl md:text-3xl font-bold truncate">
            Welcome back, {user?.displayName}
          </h2>
        </div>
        <button className="bg-blue-500 px-4 md:px-6 py-2 rounded-lg text-white text-sm md:text-base self-start md:self-center">
          Profile
        </button>
      </div>

      {/* Assistants Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 sm:gap-6 md:gap-8">
        {Experlist.map((item, index) => (
          <BlurFade key={item.icon} delay={0.25 + index * 0.05} inView>
            <UserInputDialong options={item}>
            <div className="p-4 bg-gray-100 rounded-2xl flex flex-col justify-center items-center shadow hover:shadow-md transition">
              <Image
                src={item.icon}
                alt={item.name}
                width={200}
                height={200}
                className="w-16 sm:w-20 md:w-24 lg:w-28 h-auto"
              />
              <h2 className="mt-3 text-xs sm:text-sm md:text-base font-medium text-center">
                {item.name}
              </h2>
            </div>
            </UserInputDialong>
          </BlurFade>
        ))}
      </div>
    </div>
  )
}

export default FeaturesAssistants
