export const IDO_STATUS_UPCOMING = 'Upcoming'
export const IDO_STATUS_ENDED = 'Ended'

interface AnnouncedIDOItem {
  id: number
  title: string
  description?: string
  status: string
  launchpad: string
  announcementUrl: string
  projectIconLocation: string
  projectUrl: string
  startTime?: string
  endTime?: string
}

export const IDO_LIST: Array<AnnouncedIDOItem> = [
  {
    id: 1,
    title: 'Sherpa Cash',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: IDO_STATUS_ENDED,
    launchpad: 'Penguin Finance',
    announcementUrl:
      'https://penguin-finance.medium.com/penguin-launchpad-staking-for-the-upcoming-sherpa-distribution-is-now-live-239267f2b9db',
    projectIconLocation: require('../assets/images/omelette_logo.png'),
    projectUrl: 'https://sherpa.cash/',
    startTime: '',
    endTime: ''
  },
  {
    id: 10,
    title: 'Colony',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
    status: IDO_STATUS_UPCOMING,
    launchpad: 'Avalaunch',
    announcementUrl: 'https://launchpad.avalaunch.app/project-details?id=12',
    projectIconLocation: require('../assets/images/omelette_logo.png'),
    projectUrl: 'https://colonylab.io/',
    startTime: '',
    endTime: ''
  }
]
