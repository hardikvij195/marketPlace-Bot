import { Loader } from "lucide-react"

const loading = () => {
  return (
    <div   className=""  >
      <Loader   className=" animate-spin duration-300"   />
      <p>Please Wait...</p>
    </div>
  )
}
export default loading