
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { DialogClose } from '@radix-ui/react-dialog'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { LoaderCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'

export  const staff = [
        {
            name: 'Krish',
            pic: '/agent1.svg',
            gender: "male"
        },
        {
            name: 'Harshitha',
            pic: '/agent2.svg',
            gender: "female"
        },
        {
            name: 'Maveen',
            pic: '/agent3.svg',
            gender: "male"
        },
        {
            name: 'latha',
            pic: '/agent4.svg',
            gender: "female"
        }
    ];

function UserInputDialong({ children, options ,Setroomid,SetData}) {
   
    const [selectStaff, setSelectStaff] = useState();
    const [topic , setTopic] = useState(); 
    const CreateDisscusionRoom = useMutation(api.DicussRoom.CreaatedRoom)
    const [Loading , setLoading] = useState(false)
    const [openDialoge , setOpenDialoge] = useState(false)
    const router = useRouter()
    const HandleData=async()=>{
        setLoading(true)
        const res = await CreateDisscusionRoom({
            topic:topic,
            coachingOption:options?.name,
            Mentor:selectStaff
        })
        
        setLoading(false)
        setOpenDialoge(false)
        Setroomid(res);
        SetData(selectStaff);
        // router.push('/dashboard/discussion-room/'+res);
    } 
    return (
        <Dialog open={openDialoge} onOpenChange={setOpenDialoge} >
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>{options.name}</DialogTitle>
                    <DialogDescription asChild>
                        <div>
                            <h2 className='text-black'>Enter a topic to master your skills in {options.name}</h2>
                            <Textarea  placeholder='Enter your Topic here...' className='mt-3' onChange={(e)=>setTopic(e.target.value)} />
                            <h2 className='text-black font-bold mt-3'>Select Your Ai Coaching Expert</h2>
                            <div className='grid grid-cols-3 md:grid-cols-6 gap-6 mt-2'>
                                {staff.map((item, index) => (
                                    <div key={index} onClick={() => setSelectStaff(item.name) } >
                                        <Image
                                            src={item.pic}
                                            alt={item.name}
                                            width={100}
                                            height={100}
                                            className={`rounded-xl h-[80px] w-[100px] object-cover hover:scale-105 transition-all cursor-pointer p-1 border-gray-400 ${selectStaff === item.name ? 'border' : ''}`}
                                        />

                                        <h2 className='text-center' >{item.name}</h2>
                                    </div>

                                ))}

                            </div>
                            <div className='flex flex-row justify-end gap-3'>
                                <DialogClose asChild>
                                      <Button variant={'ghost'}>Cancel</Button>
                                </DialogClose>
                                
                                <Button disabled={(!topic || !staff || Loading )} onClick={HandleData}  >
                                    {Loading && <LoaderCircle className='animate-spin' />}
                                    
                                    Next</Button>
                               
                            </div>
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default UserInputDialong