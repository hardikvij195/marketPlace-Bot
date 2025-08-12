import { MessageSquare, Clock, MoveUpRight, Shield } from 'lucide-react'
import { FaBolt, FaUsers } from 'react-icons/fa'

const features = [
  {
    icon: <MessageSquare className="text-[#2563EB] text-3xl" />,
    title: 'Intelligent Chat Responses',
    desc: 'AI-powered responses that sound natural and help close deals faster',
  },
  {
    icon: <Clock className="text-[#2563EB] text-3xl" />,
    title: '24/7 Automation',
    desc: 'AI-powered responses that sound natural and help close deals faster',
  },
  {
    icon: <MoveUpRight className="text-[#2563EB] text-3xl" />,
    title: 'Increase Sales',
    desc: 'AI-powered responses that sound natural and help close deals faster',
  },
  {
    icon: <Shield className="text-[#2563EB] text-3xl" />,
    title: 'Safe and secure',
    desc: 'AI-powered responses that sound natural and help close deals faster',
  },
  {
    icon: <FaBolt className="text-[#2563EB] text-3xl" />,
    title: 'Quick Setup',
    desc: 'AI-powered responses that sound natural and help close deals faster',
  },
  {
    icon: <FaUsers className="text-[#2563EB] text-3xl" />,
    title: 'Customer Management',
    desc: 'AI-powered responses that sound natural and help close deals faster',
  },
]

export default function WhyChooseUs() {
  return (
    <section className="py-10 px-4 md:px-12 lg:px-24 text-black">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Why choose us?</h2>
        <p className="text-lg text-black mt-3 max-w-2xl mx-auto">
          Transform your Facebook Marketplace experience with cutting-edge automation that actually works
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <div
            key={i}
            className=" p-6 rounded-2xl shadow-lg flex flex-col gap-4"
          >
            {feature.icon}
            <h3 className="text-lg font-bold">{feature.title}</h3>
            <p className="text-sm text-black">{feature.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}