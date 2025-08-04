"use client";
import React, { useEffect, useState } from "react";
import ToolInvoiceTable from "../_components/ToolsInvoice";
import { Button } from "@/components/ui/button"; // or use HTML button
import { toast } from "sonner";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { showToast } from "@/hooks/useToast";
import Modal from "@/app/components/Modal";
import { Eye, Download } from "lucide-react";
type Website = {
  name: string;
  url: string;
  image: string;
};

const websites: Website[] = [
  {
    name: "Dealertrack - Finance A Client",
    url: "https://www.dealertrack.ca/",
    image:
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADHCAMAAABr0Ox5AAAAkFBMVEUdPnT///9Sa5QcPXMeQHgaO3K1wNIrSnzh5exIY48eP3ROaJLl6e8WOHAeQXkQM2yQoLr3+Pry9PcgRH/V2+UzUYIlRXn09vhcdJvCy9oNMGqGmLXM1OA6V4Z2iqtCXouotcpyh6m5w9SsuMx0iKlqf6ONnrmaqcHHz9xkeqB+kbDR2OMFKWU4VYcnR3mXp78+AccZAAAN8UlEQVR4nNWdaXuqPBCGQYIgAspareLW17qd1v//714UgstMSMIi9vl0rkNtc5tkJpmZBEVtQZ734fun/mp2XE96uSbb42w1DX3/w/Pa+JtKw7/PN0/T1aKXkCAIXJJKyXX5t5v+J4kms69paH40/IebBPHnq+/tMk4bWzQfyEqRUh5juB5/nZqEaQzE3G2HieWyEZ5EXCvpbVd2U3+/GZBwFhmxKMK9YmNw9htpQgMg9s4Q7gdM7vKrAZaaIJ7ZnwRuHYyLAne7rzvGaoH4m5kR1OoNKhIsv6ddgfjjXtwIRYbiGpNVFyAfix+rOYyMJV6eXw3izRqGoCxG1V6pBOLvSO0JzpJrTCvZsAog/uqnne7IFQw3FVZj8iCrXskKpBER6yBvwWRBwsFvyxhXFGMiO74kQWaVFiIVZBlfLYKEw+BFHKncrZSzlwDxV8oLRtUdSSQz6cVB9pMXdkeOsjCbB9kZr8ZIRZabpkHWLx1VN7miixYxkI+kIw7FCrZiE0UIZN7agkRAJAkbAvF2VoccqWKRiSIAsuiYIyXZNQEy7BojFZnVB0m6hrjK3dYE8X+6RshFtpxoXjlI2JnZhZqUL71KQezofThSktKVfSnIq9bsgupVBXkzDoUcKoF4XawSy0VKbBcTxO913WxE5CgN8rHoutGo2D6eBXJ+J3t1J5cVX2GA7F++GxQVYbgTHMQMOl8oMhXh7gQFsd/PYN1EJsIg3qTrxpYKN10YyKzrpnJkYRF7BGTz23VLeVoim18IYg/f1PLeRNZwTQ9BZm9reW8KYGAYgEzf2PLeFIMQ5DOIF3XdRiGRJQ/kHUINQvouB+m/2x6EKcMuA/kYdN0+cU3KQM5/YaLnivtsEPOtgg0ckcdgxD2IN+4yWC0td8MCsf+AK7xX4jNAWk7mWED0iaYDaQK/MFjhIO3upvTJ+Eln6nv1aAhkiJDEHyhIq6ZXQ9I1y/yZc7Sf5Se6wC+935ncQKatml4N7uvoakhL5uCZKsKRdsltltxA2vWFOgTZ5asIHQmF9sVArFuXFCDTdvfpMVx4b/NpgDCqotHBpFioFCAtm6wINnaSg8TIzlU0vRQX2WsKEracmTJAW6dRDmLA/PNcdLd9c+8UZNWuU9dgEnBHp0EMO+Qobnioe89B/Em7I0uHjT072SOEUT2IeJGr3KP3ABK2vDrRQFvtXt4jOowcmksxo3VRZD+AHNsdWYhh2o/yZyPYISsJlxZs7kG8lpe9I1iuREEw47tzxH81Gd6DbFoeWZ+grd4ib+wILl38gwSIEth3IC3vcPUBbGy+vrX+wSlyioXneiryfQPxWt4Yfu4hCB1ZS+hFiukjJuMGsmuh8ff6hMPnK2/sqA8eeTM5EBIWIG2PrAjO9Sg3sP/gytc3xI3vVQsKYrccXXTGoLEq9YYIoyfXIenKkYKsWo7KjeCqcJqDODM4RXayIEaYgxwab/qjLDgPBrldGiHp5khyZCnWOAOpUxqg6ZqRDJi6Nkk7wG+92PxARlXG9maaZCD7qlNEd5Te4tgvKdr5vP7Yf+D//WJzCD9MR136HT2KHVkZ2leQVUWM0e+uX15DlY126zlwnu7i8sWUgxSX5ItJfdB/FrNINNpfQWaVFlojY8+t986alMBvvRjMSILWYDIyI9NkdwHxt1X8ukjhp5qZH5CTuTkuxPjO81FnwBpZplFyvy8gpvwmV4tLa8Co8tEOf/aL2vsEfmibPbF+wBNvyZok5OCnICfpDnGWIt2hqsn1D1vQdx+pgR3CD9FRB/uxz47zJGYKIr2EdzhlkoWy792CDxY5iAUXk3Y+PpCigDHbLpN5CvItOde1nuDxlP0VRIOBoBN1echOnlomDVgIb8vepQRTVfFk5zoyd3FlM9qBkbk+bRHSWbOcEW6Aw5JwcLBLQZbMx5iQL7gcBNmS0yW8A4ePP8la60Dfsynx+GTtKR9SHaKLc2TWUINRK3+S9wjcAKfDMWvuJ5yGu88SkKGn2DJZEc0RP+n4fW0SsoQ36erWgR/a0P0WxB+WbeR/fWUuY7RGsMeZOl7/8Cd0eXb+1TowMudlH1Ic6PFtrWwxGfiKTKxUx+qLGMpHOzJGjnRkwV9mx9kUQTb505KRlYKYyrfEHEGWf0xtrk1yDrAgiQ4RhJGOun/w0aQ0RBTslaMESCJ+LDA3TSNkTlGbdYCLyVX2zEHq+a3SbYrbVw4SINzTKHeaXb9BxDhQL4LET9TcVSB7Y/Oz1Ca5Z0Vme4gvTUxMe+XyDeoDJH6Sf7WfyBEwNuO6PPhIZor42hf1hdMoMlBlUwRJGdA1yBIyTrORpQ/gNxaVb4DJWgJER0bWrDxQgDjoOX2E7KnykaXBvHuPE5AgW2EMNKS+Ucq/qAhOEVpTjHUWTbghlRC8xkkUzCGLDW5wE9l/0aUdsgMMZeNA939J/EcdmMig/ov96+FHomyOaMieSmZ41ABBHPGp1NveJ48LHfNHGEidELQ4iGZBU7LijCyYk1bXdHOILCbrhKDFQfQl9LYcm4hVCRxyEIRxVqcYRhwE8bb+v/I/ra/BRza0fAlJrq/lY6VVQHS4IP3ipPoc2Ic00o74JJ/nK5oBweqteNkIZOM0pukEOOHqlRwPRT075og5HYIkns2EGVtQVzKp3Gelnl0QRIOWdM/5CJJ4PhUpUPCIbg4rgqwFfbuGOGLesPyE8a8p3ZLDCWfKZg4fQWaC+xF9AFvFMfv6D/iI18u+dSy5Hsom3B6U7kcEC86glZlzSu5GsA+9IgXaQObwEWSliN3BhjjiA2cojE4QJF/SjGD00ROqj2UqmApGUX7hWJiUg2gxnOszGj+BU+TDqQdiC8a1oJUJmdmKTM4CDh86sizIuOesP3kgviJUEK9DL8IrRcISzzqbcVjHZl0KgBVfZGiN4Mj65kzOGAYQvqg3RC42qoWhkIGnfAgsnjW4VrU5KyMs8Ux9rw7Xn2Edb3hx7J7iCTgSJMO65618kUhFbq/1IVxo9WpNdcUdq4pIdvoTWtI+Z2RZC/CRE60SQO6gqHmPzCVjpfa5s11ToI/mVeshiediSw4Z/ZplPe4lh8i/PMuBWUOfZy2RxDMtIUcYJQqWUUVhChJyZzsS3Ax5IPBbt2lFEMygF4wVRSZ2CmLzirA1DfovTihWQU6Xn2ljYWf5g5pz/eilIB6veFlfQivj4AHfXBEysNRvyg4dTN3KN3eXVQdxemSEpMhA5c6D0MInWuiLJNfH9dz6NWqpXALq5T+mS94qimvOjp943IHK0SV5oVxmYelPaT/IESh50c2hA9dgc6mCZajr5UjXmsbSsYUVr8vL+48mcdgb4KqyZjnIuXSuWeyLhyREc9JYBl3ikAUqY5+DhKWbVuwIlLzonsqBDqY88Sygq2O6GvyykJCF7K/lZRYdAn2SdHnssw4FSOmNLkLFcjwVo+cfWJ/UNVkKmRYgZtlslygSYKpYLzpgm7KvfSCVqAVI2SoaOQIlrVsRH4ifeEldkPzAbgayY65SJOqzmDIHxSx4BvE4sRgBBeEdCHvjjlgZWdm3AiU9edqiSR1CwpV/0/kyleUTLaS8RVLz5a2xz9XlpTVYYgp2DyBzRvkZkpOW1Ow+8/vYv9NacWsq8wHEXuJd4pTd8Siix8Dq7/0U+a/eCisTWfsPIOoZnyVIcFNC4cp5HDu30292P6o/rC4gT2d11T26TMFy0qLy+jvjeTVII6+b1XLUxLBSSBFaKvakaPkvUu0gJnv33yQGcelrTP9jtzgYTiMYqYpNXwGCVp7r0bAnr+EyiWL03Mry+kgRuixESD8hAGn7DF87utmiG4jMkeV30d3FZ3dxm/e4xltKd1P4DqTtI9TNy7VRkL9zbVsu9z5OdQ/yzlexYnpwcg/3ay3+1v1aD4GlhyDt6c9cpadcbjg0mSCqTH1513qK7jyCVDjK15merl94iv+P/8zgiqelIH/HKz5vlJ5Bwj9igUHaC6SWdn/CmRCw4YM5ssP7OxMrgMVKEKQ8pP0WIsghWyRryUvFdS8DOfCE3VL+nq9VuAk9s4aB2HKnXl8u9KgXepN/6L6z5fpBw+r4uxWm77vHsgI8QsV42wU7PN+1AkaOmQHirbtuMEOEdUsD60Uq9pvue5FyyHKQeudrWhNSYMgDUe03NF0JO8Nc8h6r97tZuixZU/ZCLvu9TBdBzmWJgajTd7p+nSAlhKIg3AqoF4pE5bcbcN6HGMbvMuMjTsqJ94ZKqUs6WlTp/BABKc6fdyt49aY8yBu8AcNac1sp8jpav6vXNVO5Y4FKK5E3HXu7Tl0j8z110iCdvrOZPL/6pRaI6ncVgSTIJY91QFSvmxc3G8g1qPVAVHWVvHw5HPTEL48SB1HDxYvnfLCTKCCRAFG9jfVCQ0yei9SaA7kcEXsZh7WWK9OVA0lnykuCdyQeiM+OaiCqf0xadypkgJxUbBoknfRHl7Rovyw3Pkvc41UDRPXMQ3v2iwTflYrdqoCkMoctjS+X90L5hkFUdd9rISFkTCoMqpogKco2IQ36FaIM1uKXDjYJoqqn3SRoaIgRsl1V7o3aIKkxDmdW/YlPguhs1jxMUBMklTft1RtgxN2G9Q/b1AdJ5a2WRsXajzjqIdccVlAjIKn8r3UvsVyJviFunPTWzVCozYGk8uar2XapBC7PlhESBPFg/f1Vw0gBNQhykW/O9+P10goCjIcQN30Q9xar/cms6PhYahjkKu/D98PNeLEdLn+KqRMnw956du6Hvu81cY7uWf8DxNfWookSGXgAAAAASUVORK5CYII=",
  },
  {
    name: "Sign N Drive Website",
    url: "https://www.signndrive.ca/",
    image: "/360f1ec5-3009-409d-a435-a7f84c2c8360.jpg",
  },
  {
    name: "Carfax Canada - Vehicle History Reports",
    url: "https://www.carfax.ca/",
    image: "/integration-logo-carfax.png",
  },
  {
    name: "Credit carz - Client CRM",
    url: "https://crm.creditcarz.ca/",
    image:
      "https://msgsndr-private.storage.googleapis.com/companyPhotos/db8017cc-d615-4792-a9ea-a61251e05e4a.png",
  },
  // {
  //   name: "Go High Level",
  //   url: "https://help.gohighlevel.com/support/login",
  //   image:
  //     "https://s3.amazonaws.com/cdn.freshdesk.com/data/helpdesk/attachments/production/48024308683/logo/s7aCRjbTgZ5t0wA0EwvURVFjWacwx1uM_A.png",
  // },
  {
    name: "Sign N Drive Android app",
    url: "https://play.google.com/store/apps/details?id=ca.signndrive",
    image: "/google-play-store-svgrepo-com.svg",
  },
  {
    name: "Sign N Drive iOS app",
    url: "https://apps.apple.com/ca/app/sign-n-drive/id1524972908",
    image: "/app-store-svgrepo-com.svg",
  },
  {
    name: "Auto Corp - ID Verify / Credit Soft Checks",
    url: "https://portal.autocorp.ai/login",
    image: "/autocorptech.jpeg",
  },
];
export default function page() {
  const router = useRouter();
  const { user } = useSelector((state: any) => state?.user);
  const [isFileOpen, setIsFileOpen] = useState<boolean>(false);
  const [fileDetails, setFileDetails] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [urls, setUrls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const handleOpenWidget = (url: string) => {
    window.open(url, "_blank");
  };

  const handleDownloadFileInNewWindow = async (url: string, filename: string) => {
    // Attempt to open a new, blank window/tab first
    const newWindow = window.open('about:blank', '_blank');

    if (!newWindow) {
      showToast({
        type: "error",
        title: "Error",
        description: "Pop-ups blocked or failed to open new window. Please allow pop-ups for this site to download files.",
      });
      return; // Stop if new window couldn't be opened
    }

    try {
      // Fetch the file content
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const blob = await response.blob(); // Get the file content as a Blob

      // Create a temporary URL for the blob
      const blobUrl = URL.createObjectURL(blob);

      // Create a temporary anchor element within the new window's document
      const a = newWindow.document.createElement('a');
      a.href = blobUrl;
      a.download = filename; // Set the download attribute with the desired filename
      newWindow.document.body.appendChild(a);

      // Programmatically click the link
      a.click();

      // Clean up: Remove the temporary link and revoke the blob URL
      newWindow.document.body.removeChild(a);
      URL.revokeObjectURL(blobUrl); // Release the memory associated with the blob URL

      // You might want to close the new window if the download starts immediately
      // Forcing close immediately might prevent the download prompt in some browsers,
      // so it's often better to let the user close it after the download starts.
      // newWindow.close(); // Uncomment with caution if needed
      showToast({
        title: "Success",
        description: "Download initiated in a new window.",
      });

    } catch (error: any) {
      console.error("Error during download:", error);
      // Close the new window if an error occurred before download started
      if (newWindow && !newWindow.closed) {
        newWindow.close();
      }
      showToast({
        type: "error",
        title: "Error",
        description: `Failed to download file: ${error.message || "Unknown error"}`,
      });
    }
  };

  const fetchNote = async () => {
    setLoading(true);
    const { data, error } = await supabaseBrowser
      .from("details")
      .select("*")
      .eq("user_id", user?.id) // Adjust your ID logic
      .single();

    if (error) {
      // toast.error("Failed to fetch content");
    } else {
      setContent(data.content || "");
      setUrls(data.attachments || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchNote();
  }, [user?.id]);

  const handleFileOpened = (url: string) => {
    if (!url) {
      return showToast({
        type: "error",
        title: "Error",
        description: "File Not Found.",
      });
    }
    return window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      {loading ? (
        <div className="max-w-4xl mx-auto lg:p-6 md:p-6 p-2 animate-pulse">
          <div className="flex justify-between items-center mb-4">
            <div className="h-6 w-40 bg-gray-300 rounded" />
          </div>
          <div className="border border-gray-300 rounded-md p-4 min-h-[300px] bg-gray-100 space-y-4">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-2/3" />
            <div className="h-4 bg-gray-300 rounded w-full" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
          </div>
        </div>
      ) : (
        <>
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            {content && (
              <div className="mb-10">
               
                {urls && (
                  <button className="flex justify-between items-center bg-blue-700 text-white h-12 my-5  p-4 rounded-md shadow-md">
                    <span
                      className="cursor-pointer"
                      onClick={() => {
                        setIsFileOpen(true);
                        setFileDetails(urls);
                      }}
                    >
                      View Files
                    </span>
                  </button>
                )}

                <div className="border border-gray-300 rounded-md p-4 min-h-[300px] bg-gray-50 whitespace-pre-wrap text-sm sm:text-base">
                  {loading
                    ? "Loading..."
                    : (
                        <>
                          <div
                            className="prose max-w-none prose-table:table-auto prose-th:font-semibold prose-th:text-left"
                            dangerouslySetInnerHTML={{
                              __html: content,
                            }}
                          />
                        </>
                      ) || "No content available."}
                </div>
              </div>
            )}

            <main className="min-h-screen py-10">
              <h2 className="text-2xl font-semibold mb-6">Useful websites</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {websites.map((site, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-2xl shadow border border-gray-200 p-4 flex flex-col justify-between h-full"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden border bg-gray-100 shrink-0">
                        <img
                          src={site.image}
                          alt={site.name}
                          className="object-cover w-full h-full"
                        />
                      </div>
                      <p className="text-sm font-medium text-gray-900">
                        {site.name}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      {/* Show full button on sm and up */}
                      <button
                        onClick={() => handleOpenWidget(site.url)}
                        className="hidden sm:block bg-blue-600 text-white w-full py-2 rounded-md hover:bg-blue-700 transition text-sm"
                      >
                        Open website
                      </button>

                      {/* Show icon on mobile */}
                      <button
                        onClick={() => handleOpenWidget(site.url)}
                        className="sm:hidden text-blue-600 hover:text-blue-800 transition text-lg"
                        title="Open Website"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="w-5 h-5"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M14 3h7v7h-2V6.41l-9.29 9.3-1.42-1.42 9.3-9.29H14V3z" />
                          <path d="M5 5h5V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-5h-2v5H5V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </main>
          </div>
        </>
      )}

     <Modal isOpen={isFileOpen} onClose={() => setIsFileOpen(false)}>
  <div className="mt-5 mb-5 max-w-md mx-auto bg-white shadow-md rounded-xl max-h-[80vh] overflow-y-auto p-6">
    <h2 className="text-lg font-semibold text-gray-800 mb-4">
      Document Lists
    </h2>
    <div className="text-sm text-gray-700 space-y-4">
      <ul className="mt-2 space-y-2">
        {fileDetails?.map((file, idx) => (
          <li key={idx} className="flex items-center justify-between text-sm">
            <span className="truncate max-w-[200px]">{file.name}</span>
            <div className="flex items-center gap-2">
              <a
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                title="View File"
              >
                <Eye className="h-4 w-4 text-gray-600 hover:text-blue-600" />
              </a>
              <button
                onClick={() => handleDownloadFileInNewWindow(file.url, file.name)}
                className="text-green-600 hover:text-green-800 bg-transparent border-none p-0 m-0"
                title="Download File"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  </div>
</Modal>

    </>
  );
}
