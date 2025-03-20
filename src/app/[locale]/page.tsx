'use client';

import { Waypoints } from 'lucide-react';
import Head from 'next/head';
import Image from 'next/image';
import * as React from 'react';
import '@/lib/env';

import { AchievementCard } from '@/components/achievement-card';
import Navbar from '@/components/layout/navbar';

/**
 * SVGR Support
 * Caveat: No React Props Type.
 *
 * You can override the next-env if the type is important to you
 * @see https://stackoverflow.com/questions/68103844/how-to-override-next-js-svg-module-declaration
 */

// !STARTERCONF -> Select !STARTERCONF and CMD + SHIFT + F
// Before you begin editing, follow all comments with `STARTERCONF`,
// to customize the default configuration.

const FLOATING_ITEMS = [
  {
    title: 'What can you achieve with ADA',
    points: [
      'Unlock job opportunities that match your skills and career goals.',
      'Apply with confidence using optimized resumes and tailored recommendations.',
      'Get continuous support with career and skill development guidance.',
    ],
  },
  {
    title: 'What is ADA',
    points: [
      'ADA is an intelligent job platform that`s equally accessible for everyone. Our mission is to empowering job seekers with disabilities and enabling inclusive hiring through intelligent, accessible AI-driven solutions',
    ],
  },
  {
    title: 'What sets ADA apart',
    points: [
      'We help you find the right job, tailored to your unique skills and abilities.',
      'An easy-to-use, fully accessible platform designed for your needs.',
      'Our commitment to inclusion, driven by the #PastiADAKarier campaign, connects you with employers who value your talent.',
    ],
  },
];

import Footer from '@/components/layout/footer';

import mainGif from '~/gif/people-gif.gif';
import aida from '~/images/aidalogo.png';
import btp from '~/images/btplogo.png';
import cv from '~/images/cvimg.png';
import telyu from '~/images/telyulogo.png';

export default function HomePage() {
  return (
    <main>
      <Head>
        <title>Hi</title>
      </Head>
      <section className='bg-white'>
        <Navbar />
      </section>
      <section>
        <main className='text-center mt-10  mx-auto max-w-6xl px-4 w-full flex flex-col items-center'>
          <h1 className='font-medium text-3xl'>ADA.AI</h1>
          <h2 className='font-bold text-6xl text-gradient-ms pb-2'>
            Your Accessible AI Career Platform
          </h2>
          <div className='relative  w-full flex items-center justify-center my-12'>
            <AchievementCard
              type='points'
              points={FLOATING_ITEMS[0].points}
              title={FLOATING_ITEMS[0].title}
              imageAlt='Achievement Logo'
              className='absolute left-0 top-1/2'
            />
            <AchievementCard
              type='desc'
              description={FLOATING_ITEMS[1].points[0]}
              title={FLOATING_ITEMS[1].title}
              imageAlt='Achievement Logo'
              className='absolute right-0 top-0'
            />
            <AchievementCard
              type='points'
              points={FLOATING_ITEMS[2].points}
              description='loremipsum dolor'
              title={FLOATING_ITEMS[2].title}
              imageAlt='Achievement Logo'
              className='absolute right-0 bottom-0'
            />

            {/* <div className='absolute left-0 top-1/2 bg-white backdrop-blur-sm bg-opacity-30 p-3 rounded-md flex z-[99] max-w-[480px] !text-start gap-3'>
            <Image
              src={achievement}
              width={24}
              height={24}
              alt='Achievement Logo'
            />
            <div>
              <p className='font-bold items-start text-start'>
                What you can achieve with ADA?
              </p>
              <p className='text-sm'>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </p>
            </div>
          </div> */}
            <Image
              className='translate-x-20'
              src={mainGif}
              alt='GIF People searching Jobs'
              width={900}
              style={{
                animation: 'infinite',
              }}
              height={900}
            />
          </div>
          <div className='w-full py-2 px-2 rounded-md'>
            <div>
              <h1 className='text-gradient-ms text-5xl pt-4'>
                Don't Worry, #PastiADAKarier!
              </h1>
              <p className='text-gray-500 text-center mt-3'>
                Empowering job seekers with disabilities by offering
                intelligent, AI-driven solutions that make it easier
                <br />
                to find inclusive opportunities and connect with employers who
                value your unique talents.
              </p>
            </div>
            <div className='mt-20 mb-10'>
              <h2 className='text-lg text-gray-600 text-center flex flex-col items-center font-medium'>
                Our Support Team
              </h2>
              <div className='flex items-center justify-center gap-4 mt-2'>
                <Image src={btp} alt='BTP Logo' width={180} height={180} />
                <Image
                  src={telyu}
                  alt='Telkom University Logo'
                  width={180}
                  height={180}
                />
              </div>
            </div>
            <div className='mt-10 grid grid-cols-7 gap-y-5 gap-x-6 text-start'>
              <div className='col-span-5 rounded-md border-gradient-ms flex items-center justify-center'>
                <div className='grid grid-cols-7 p-10 justify-center'>
                  <div className='w-14 h-14 flex-1 flex-grow rounded-full bg-ms-rainbow text-white border-[1px] border-indigo-500 flex items-center justify-center'>
                    <Waypoints />
                  </div>
                  <div className='flex flex-col gap-2 col-span-6'>
                    <p className='font-semibold text-2xl text-gradient-ms'>
                      Inclusive Job Matching Algorithm
                    </p>
                    <p className='text-sm leading-loose font-light'>
                      An inclusive job matching algorithm that connects
                      candidates to opportunities by focusing on skills and
                      potential, with just one click to submit your CV. Say
                      goodbye to the stress of hunting across multiple job
                      platform.
                    </p>
                  </div>
                </div>
              </div>
              <div className='col-span-2 text-white flex flex-col gap-5 rounded-md bg-gradient-to-b from-[#988bea] to-[#8A79FD] px-4 pt-8'>
                <h5 className='font-semibold text-xl'>AI Powered CV Builder</h5>
                <p className='text-sm leading-relaxed font-light'>
                  No CV? No problem. Our AI-powered CV Builder creates a
                  professional, tailored resume from scratch. Just provide your
                  background, and our AI will craft a polished, optimized CV
                  that highlights your skills, experience, and strengths—making
                  job applications easier than ever
                </p>
                <Image
                  alt='CV Image'
                  src={cv}
                  width={260}
                  height={194}
                  className='translate-y-3'
                />
              </div>
              <div className='col-span-2 text-white flex flex-col gap-5 rounded-md bg-gradient-to-b from-[#988bea] to-[#8A79FD] px-4 py-8'>
                <h5 className='font-semibold text-xl'>
                  Courses & Career Update Recomendation
                </h5>
                <p className='text-sm leading-relaxed font-light'>
                  This feature provides a dynamic career pathway update, guiding
                  users from entry-level roles, like Junior Developer, to
                  advanced positions, such as Senior Developer. <br />
                  <br />
                  Progression is based on assessment tests that identify skill
                  gaps and growth areas, while recommended courses are tailored
                  to help users prepare for each assessment.
                </p>
              </div>
              <div className='col-span-5 p-4 overflow-hidden rounded-md border-gradient-ms gap-x-4 items-center justify-center grid grid-cols-2'>
                <div className='grid grid-cols-7 gap-x-12'>
                  <Image src={aida} alt='AIDA logo' width={52} height={52} />
                  <div className='flex flex-col gap-y-3 col-span-6'>
                    <h5 className='text-xl text-gradient-ms font-semibold'>
                      Say hi to AIDA, your AI Career Assistance
                    </h5>
                    <p className='leading-relaxed font-light'>
                      AIDA offers quick, easy-to-digest insights and reminders
                      to keep you focused and confident as you work toward your
                      career goals. It helps you find the right job, stand out
                      in interviews with relevant company insights, and see why
                      you’re the perfect fit.
                    </p>
                  </div>
                </div>
                {/* <Image
                  src={aidamockup}
                  alt='AIDA Mockup'
                  width={480}
                  height={280}
                /> */}
                <video
                  src='/vid/aida.webm'
                  width={480}
                  height={240}
                  controls
                  playsInline
                  muted
                  autoPlay
                ></video>{' '}
              </div>
            </div>
          </div>
        </main>
      </section>
      <section>
        <Footer />
      </section>
    </main>
  );
}
