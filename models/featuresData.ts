import { BsFillMoonFill, BsStars } from 'react-icons/bs'
import { FaAccessibleIcon, FaExpandAlt, FaPaintBrush } from 'react-icons/fa'
import { IoRocketSharp } from 'react-icons/io5'

export const features = [
  {
    name: 'NFT Schemas',
    description: 'Define Types for Verifiable Objects on your Sonr powered App.',
    icon: BsStars,
  },
    {
    name: 'IPFS Storage',
    description: 'Leverage decentralized storage for uploading application or user specific assets',
    icon: BsFillMoonFill,
  },
  {
    name: 'Hosting',
    description:
      "Host simple static websites on the Sonr Network, backed with IPFS.",
    icon: FaPaintBrush,
  },
  {
    name: 'Realtime Streams',
    description:
      'Create connected realtime channels of data with defined messages.',
    icon: IoRocketSharp,
  },
  {
    name: 'Graph',
    description: 'Visualize the interactions between the key components of your application',
    icon: FaExpandAlt,
  },
  {
    name: 'Functions',
    description:
      "Deploy simple Javascript functions to interact with your App's components.",
    icon: FaAccessibleIcon,
  },
]
