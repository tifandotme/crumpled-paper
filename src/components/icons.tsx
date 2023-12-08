import { AvatarIcon, ImageIcon } from "@radix-ui/react-icons"

type IconProps = React.HTMLAttributes<SVGElement>

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
  Avatar: AvatarIcon,
  Placeholder: ImageIcon,
}
