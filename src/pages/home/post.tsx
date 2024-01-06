import React, { useState, useRef, useEffect, useContext } from 'react'
import Image from 'next/image'
import { UserContext } from '@/contexts/UserProvider';
import toast from 'react-hot-toast'

import EmojiPicker from 'emoji-picker-react';


const Post = (props: { addpost: Function, reply?: string }) => {
  const { addpost, reply } = props;

  const [postcontent, setPostcontent] = useState('');
  const newPostRef = useRef(null);
  const [avatar, setAvatar] = useState('/avatars/default_profile_normal.png');

  // @ts-ignore
  const { myProfile } = useContext(UserContext)

  const handleChange = (e: any) => {
    setPostcontent(e.target.value);
  }

  const postNewContent = () => {
    if (postcontent != '') {
      let newData = {};
      if (!reply) {
        newData = {
          poster_id: myProfile._id,
          content: postcontent,
          type: 'main'
        }
      } else {
        newData = {
          poster_id: myProfile._id,
          content: postcontent,
          type: 'reply',
          reply
        }
      }
      addpost(newData);
      setPostcontent('');
    } else {
      toast.error("Please fill the content");
    }
  }

  useEffect(() => {
    const textarea = newPostRef.current;
    if (textarea) {
      // @ts-ignore
      textarea.style.height = 'inherit'; // Set to inherit to calculate new scrollHeight
      // @ts-ignore
      textarea.style.height = `${textarea.scrollHeight}px`; // Set new height
    }
  }, [postcontent]);


  // Emoji part
  
  const [showEmojiPicker, setShowEmojiPicker] = useState<boolean>(false);
  const [chosenEmoji, setChosenEmoji] = useState<any | null>(null);

  const handleEmojiClick = (emoji: any) => {
    setChosenEmoji(emoji);
    setPostcontent((prevMessage) => prevMessage + emoji.emoji);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker((prev) => !prev);
  };

  const elementRef = useRef(null);
  const emojiElRef = useRef(null);
  const handleClick = (e: any) => {
    if(showEmojiPicker == false) return
    const element2 = emojiElRef.current;
    //@ts-ignore
    if (e.target !== elementRef.current && !element2.contains(e.target)) {
      // Your logic for when any element except the excluded one is clicked
      setShowEmojiPicker(false);
    }
  }

  return (
    <div className='bg-white dark:bg-dark-header-bg p-4 rounded-[15px] flex flex-col gap-2' onClick={handleClick}>
      <div className='flex gap-4 w-full'>
        <Image quality={100} src={myProfile.avatar || avatar} width={100} height={100} alt='Default avatar' className='w-[35px] h-[35px] rounded-full' />
        <textarea className='text-grey-2 font-normal text-[14px] leading-[20px] bg-grey-3 dark:bg-dark-body-bg w-full rounded-lg p-2 resize-none' value={postcontent} ref={newPostRef} onChange={handleChange} autoFocus />
      </div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-2 relative'>
          <Image quality={100} src={'/icons/emoji-happy.svg'} width={100} height={100} alt='Default avatar' className='w-[24px] h-[24px] cursor-pointer' onClick={toggleEmojiPicker} ref={elementRef} />
          <Image quality={100} src={'/icons/photograph.svg'} width={100} height={100} alt='Default avatar' className='w-[24px] h-[24px] cursor-pointer' />
          {showEmojiPicker && (
            <div className='absolute -bottom-3 translate-y-full z-10' ref={emojiElRef}>
              <EmojiPicker onEmojiClick={handleEmojiClick} />
            </div>
          )}
        </div>
        <div className='flex gap-4 items-center'>
          {
            !reply && (
              <div className='flex gap-2 items-center max-[875px]:hidden'>
                <h3 className='text-grey-4 text-[12px] font-normal leading-[18px]'>Share to</h3>
                <select name="share" className='px-2 py-1 rounded-lg bg-grey-3 dark:bg-dark-body-bg text-grey-2 font-normal text-[12px] leading-[16px]'>
                  <option value="all">Everyone</option>
                </select>
              </div>
            )
          }
          <button className='px-4 py-2 rounded-lg bg-secondary text-base leading-[24px] font-medium text-white' onClick={postNewContent}>
            {
              reply ? 'Reply' : 'Post'
            }
          </button>
        </div>
      </div>
    </div>
  )
}

export default Post