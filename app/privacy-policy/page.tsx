"use client"
import React from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Header from '../components/AiPage/Header'
import Footer from '../components/AiPage/Footer'


const PrivacyPolicy = () => {
  return (
    <>
      <div>
        <Header />
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.1,
              scale: {
                type: 'spring',
                damping: 50,
                stiffness: 200,
                restDelta: 0.001,
              },
            }}
            className="py-20 poppins-text overflow-hidden"
          >
            <motion.p
              initial={{ opacity: 0, x: '-40%' }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.6,
                scale: {
                  type: 'spring',
                  damping: 50,
                  stiffness: 200,
                  restDelta: 0.001,
                },
              }}
              className="text-center text-2xl md:text-3xl poppins-text font-semibold py-10"
            >
              Privacy Policy
            </motion.p>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.6,
                scale: {
                  type: 'spring',
                  damping: 50,
                  stiffness: 200,
                  restDelta: 0.001,
                },
              }}
              className="w-[95%] md:w-[90%] lg:w-[70%] xl:w-[65%] mx-auto text-justify"
            >
              <motion.div
                initial={{ opacity: 0, x: '-40%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  scale: {
                    type: 'spring',
                    damping: 50,
                    stiffness: 200,
                    restDelta: 0.001,
                  },
                }}
              >
                <p className=" mb-3">Effective Date: March 1, 2023</p>
                <p className="mb-5">
                Hv Technologies allows the Members to express themselves and does
                  its best to issue and support the most convenient Service as
                  to that. We are keen on making Hv Technologies your most exciting
                  experience in dating.
                </p>
              </motion.div>
              <motion.p
                initial={{ opacity: 0, scale: 0.7 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{
                  duration: 0.2,
                  scale: {
                    type: 'spring',
                    damping: 10,
                    stiffness: 200,
                    restDelta: 0.001,
                  },
                }}
              >
                Our favorite Hv Technologies feature is streaming tools. By using
                them, you can stream your live videos and share your emotions
                with the whole Hv Technologies community. You may stream everywhere
                and whenever you want: in a café, at home, outside, while
                listening to music or eating. You choose your decoration on your
                own. Still, you must acknowledge and adhere to the following
                rules while streaming:
              </motion.p>
              <motion.div className="mt-2 ml-2">
                <motion.div
                  initial={{ opacity: 0, x: '40%' }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.6,
                    scale: {
                      type: 'spring',
                      damping: 50,
                      stiffness: 200,
                      restDelta: 0.001,
                    },
                  }}
                  className="ml-5"
                >
                  <ul className="list-disc mt-4">
                    <li>
                      since your streams fall within the “User Content”
                      definition under the Hv Technologies Terms of Use, you may not
                      create “lives” which, including but not limited to:
                    </li>
                  </ul>
                  <motion.div
                    initial={{ opacity: 0, x: '-40%' }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.6,
                      scale: {
                        type: 'spring',
                        damping: 50,
                        stiffness: 200,
                        restDelta: 0.001,
                      },
                    }}
                    className="ml-5 flex flex-col gap-3"
                  >
                    <ul className="list-disc">
                      <li className="my-3">
                        contain obscene, pornographic, profane, defamatory,
                        abusive, offensive, indecent, threatening, harassing,
                        inflammatory, inaccurate, misrepresentation, fraudulent
                        or illegal content or actions;
                      </li>
                      <li className="mb-3">
                        promotes racism, bigotry, hatred or physical harm of any
                        kind against any group or individual;
                      </li>
                      <li className="mb-3">
                        is intended to, or does, harass, or intimidate any other
                        user or third party;
                      </li>
                      <li className="mb-3">
                        may infringe or violate any patent, trademark, trade
                        secret, copyright or other intellectual or proprietary
                        right of any party, including User Content that contains
                        others’ copyrighted content (e.g., photos, images,
                        music, movies, videos, etc.) without obtaining proper
                        permission first;
                      </li>
                    </ul>
                  </motion.div>
                  <ul className="list-disc">
                    <li className="my-3">
                    Hv Technologies is entitled to identify your streams as
                      inappropriate on its sole discretion and delete/block them
                      or make them unavailable otherwise at any time;
                    </li>
                    <li className="mb-3">
                      you are prohibited to broadcast, record, stream or
                      otherwise create your lives when it may present a danger
                      to you, your friends or family or any other people (e.g.
                      you have no rights to stream when driving, climbing,
                      cooking food on an open fire, dancing with tigers, skiing
                      or skating, etc.);
                    </li>
                    <li className="mb-3">
                      we use reasonable security measures in order to protect
                      your streams or their records against unauthorised copying
                      and distribution. However, Hv Technologies does not guarantee
                      that any unauthorised copying, use or distribution of your
                      streams or their records by third parties will not take
                      place.
                    </li>
                  </ul>
                </motion.div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: '40%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  scale: {
                    type: 'spring',
                    damping: 50,
                    stiffness: 200,
                    restDelta: 0.001,
                  },
                }}
                className="my-8"
              >
                <p>
                  You hereby release and agree to defend, hold harmless, and
                  indemnify us, and/or our subsidiaries, affiliates, directors,
                  officers, employees, agents, successors and assigns from and
                  against any allegation or claim based on, or any loss, damage,
                  settlement, cost, expense and any other liability (including
                  but not limited to reasonable attorneys’ fees incurred and/or
                  those necessary to successfully establish the right to
                  indemnification), arising from or related to: (a) any act or
                  omission by you, including, without limitation any breach of
                  the Agreement, including this Hv Technologies Streaming Policy or
                  allegation or claim of negligence, strict liability, wilful
                  misconduct or fraud of you; or (b) your streaming.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: '-40%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  scale: {
                    type: 'spring',
                    damping: 50,
                    stiffness: 200,
                    restDelta: 0.001,
                  },
                }}
                className="mt-6"
              >
                <p className="font-semibold mb-2">
                  Cancellation and Refund Policy
                </p>
                <p>
                  The terms hereof shall constitute AppSynergies Private
                  Limited’s cancellation and refund policy in relation to the
                  Solutions rendered on the Hv Technologies App.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: '40%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  scale: {
                    type: 'spring',
                    damping: 50,
                    stiffness: 200,
                    restDelta: 0.001,
                  },
                }}
                className="mt-6"
              >
                <p className="font-semibold mb-2">
                  Cancellation and Refunds by the Company
                </p>
                <p>
                  Please note that there may be certain orders that we are
                  unable to accept and must cancel. We reserve the right, at our
                  sole discretion, to refuse or cancel any order for any reason,
                  without any claims or liability to pay finance charges or
                  interest on the amount. Some situations that may result in
                  your order being canceled include but are not limited to
                  inaccuracies or errors in Solutions or pricing information,
                  technical or technological problems or problems identified in
                  relation to credit / debit fraud. We may also require
                  additional verifications or information before accepting any
                  order. We will contact you if all or any portion of your order
                  is canceled or if additional information is required to accept
                  your order. If your order is cancelled by the Company after
                  your credit / debit card has been charged, the said amount
                  will be refunded to that credit / debit card account.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: '-40%' }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.6,
                  scale: {
                    type: 'spring',
                    damping: 50,
                    stiffness: 200,
                    restDelta: 0.001,
                  },
                }}
                className="mt-6"
              >
                <p className="font-semibold mb-2">Cancellation by you</p>
                <p>
                  You agree and acknowledge that unless stated otherwise you are
                  not entitled to cancel any orders made by you on Hv Technologies
                  App. In the event you subscribe to any Solutions, the same may
                  be cancelled by you one month prior to the provision of the
                  Solutions, in such a case you will be refunded in the entire
                  amount after deducting any bank charges that may have been
                  applicable. Further during a period between one month and 14
                  days from when the Solutions are to be provided, if there is a
                  cancellation request received, we may at our discretion refund
                  50% of the amount, after deducting any bank charges that may
                  have been applicable, to you. A period of 14 days before the
                  Solutions to be provided no request for cancelation will not
                  be entertained by the Company.
                </p>
              </motion.div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
        <Footer />
      </div>
    </>
  )
}

export default PrivacyPolicy
