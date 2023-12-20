import {
  AvatarIcon,
  CounterClockwiseClockIcon,
  FileIcon,
  PersonIcon,
} from "@radix-ui/react-icons"

type IconProps = React.SVGAttributes<SVGElement>

export const Icons = {
  Logo: (props: IconProps) => (
    <svg viewBox="0 0 633 359" xmlns="http://www.w3.org/2000/svg" {...props}>
      <g
        transform="matrix(0.10000000149011612, 0, 0, -0.10000000149011612, 0, 359)"
        fill="currentColor"
        stroke="none"
      >
        <path d="M512 3570 c-173 -46 -333 -172 -405 -320 -63 -128 -78 -207 -87 -455 -12 -309 -12 -979 0 -1110 19 -210 78 -355 189 -465 114 -113 254 -170 466 -190 116 -11 1272 -14 1299 -4 14 5 16 37 16 255 l0 248 -602 3 c-598 3 -603 3 -659 26 -76 30 -132 81 -166 150 l-28 57 -3 504 c-3 481 -2 508 17 570 37 121 111 192 246 234 l70 22 2300 0 c2509 0 2351 4 2468 -58 69 -36 111 -81 145 -157 24 -50 27 -73 34 -240 5 -102 5 -336 2 -520 -6 -302 -8 -340 -27 -390 -27 -73 -94 -140 -172 -171 l-60 -24 -603 -3 -602 -3 2 -252 3 -252 590 -1 c634 -1 791 5 906 37 228 63 386 221 443 445 33 128 38 251 33 865 -4 574 -5 609 -25 694 -52 216 -164 367 -335 449 -173 83 89 76 -2803 75 -2505 0 -2581 -1 -2652 -19z" />
        <path d="M2350 1340 l0 -1340 255 0 255 0 0 1340 0 1340 -255 0 -255 0 0 -1340z" />
        <path d="M3480 1340 l0 -1340 255 0 255 0 0 1340 0 1340 -255 0 -255 0 0 -1340z" />
      </g>
    </svg>
  ),
  Spinner: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  ),
  CreditCard: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  ),
  DollarSign: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <line x1="12" x2="12" y1="2" y2="22" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  ),
  Filter: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
      stroke="currentColor"
      {...props}
    >
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  Filter2: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      stroke="currentColor"
      fill="none"
      {...props}
    >
      <path d="M3 6h18" />
      <path d="M7 12h10" />
      <path d="M10 18h4" />
    </svg>
  ),
  Sparkle: (props: IconProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      strokeWidth="0"
      stroke="currentColor"
      fill="currentColor"
      {...props}
    >
      <path d="M208,144a15.78,15.78,0,0,1-10.42,14.94l-51.65,19-19,51.61a15.92,15.92,0,0,1-29.88,0L78,178l-51.62-19a15.92,15.92,0,0,1,0-29.88l51.65-19,19-51.61a15.92,15.92,0,0,1,29.88,0l19,51.65,51.61,19A15.78,15.78,0,0,1,208,144ZM152,48h16V64a8,8,0,0,0,16,0V48h16a8,8,0,0,0,0-16H184V16a8,8,0,0,0-16,0V32H152a8,8,0,0,0,0,16Zm88,32h-8V72a8,8,0,0,0-16,0v8h-8a8,8,0,0,0,0,16h8v8a8,8,0,0,0,16,0V96h8a8,8,0,0,0,0-16Z" />
    </svg>
  ),
  File: FileIcon,
  Person: PersonIcon,
  Subscription: CounterClockwiseClockIcon,
  Avatar: AvatarIcon,
}
