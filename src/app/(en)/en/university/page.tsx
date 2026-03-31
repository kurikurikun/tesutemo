import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';
import VideoCarousel from '@/components/VideoCarousel';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'University Promotion Videos & Student Interview Videos | TesuTemo',
  description:
    'Student interview videos that resonate with prospective students and convey the real appeal of your university. Share campus life and academic experiences through authentic student voices.',
  alternates: {
    canonical: 'https://www.tesutemo.co/en/university',
    languages: { ja: 'https://www.tesutemo.co/university' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function UniversityPage() {
  return (
    <SubpageLayout
      locale="en"
      currentPath="/en/university"
      heroTitle={
        <>
          Attract more applicants with real student voices.
          <br /><span className="text-primary">University Promotion Interview Video</span> Service
        </>
      }
      heroSubtitle={
        <>
          <span className="text-primary font-semibold">Authentic voices</span> that resonate with prospective students
          <br />
          <span className="text-primary font-semibold">Affordable</span> video promotion for universities
        </>
      }
      heroVideoUrl={v('1017754838', '2df374323e')}
      problemHeading="Promoting your university, but not being chosen"
      problemSubheading={<>Your university is putting information out there,<br />but are you experiencing these challenges?</>}
      problems={[
        'You want to share diverse student voices, but your budget is limited',
        'You built a department website, but prospective students never find it',
        'You know social media matters, but you lack compelling content',
        'Professors want to convey the appeal of their courses, but cannot find the time',
        'People see your pamphlets, but you want to drive them online',
      ]}
      problemConclusion={<>As a result,<br />your university&rsquo;s appeal is not fully communicated, leading to mismatches with prospective students.</>}
      solutionTitle="TesuTemo communicates through real voices"
      solutionSubtitle={<>Through interviews with current and former students,<br />we make your university&rsquo;s true appeal visible</>}
      solutionPoints={['Content that helps prospective students decide if your university is the right fit']}
      videoSectionTitle="Real voices change applicant decisions"
      videoSectionSubtitle="Interview Videos (Horizontal: 90-120 sec / Vertical: 30-60 sec)"
      videoHorizontalDesc={<>Horizontal videos are for <span className="text-primary font-bold">&ldquo;telling your story in depth&rdquo;</span> on university websites and at open days</>}
      videoVerticalDesc={<>Vertical videos are for <span className="text-primary font-bold">&ldquo;getting discovered&rdquo;</span> on social media</>}
      onlineFeatures={[
        { title: 'Filmed in their own environment', desc: 'By speaking into their own smartphone, students are relaxed and share genuinely authentic stories' },
        { title: 'High-quality recording via dedicated software', desc: 'Our proprietary software requires no login or sign-up, maintaining audio and video quality while making it easy for students to participate' },
        { title: 'Optimized for student channels', desc: 'Content tailored for the social media platforms that prospective students use every day' },
      ]}
      horizontalVideos={[
        v('1019675789', '8ca81d7847'),
        v('1082523091'),
        v('1049154514'),
        v('1019649377'),
      ]}
      verticalVideos={[
        v('1020046986', '83e6b0fedd'),
        v('1049144140'),
        v('1169470823', 'af1c20547e'),
      ]}
      companyLabel="University"
      companyPlaceholder="University name"
    >
      {/* How TesuTemo transforms your promotion efforts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              How TesuTemo Transforms Your Promotion Efforts
            </h2>
            <p className="text-lg text-gray-600">Here is how adopting TesuTemo changes your outreach and student recruitment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Ready-to-use video assets', desc: 'Get vertical and horizontal video assets\nperfect for social media and open day events' },
              { title: 'Reduced production effort', desc: 'Dramatically reduce production workload,\nlightening the burden on your team' },
              { title: 'Content that resonates', desc: 'Authentic voices are trusted by Gen Z and Gen Alpha, generating genuine engagement' },
              { title: 'Easy budget approval', desc: 'Affordable pricing and flexible plans make it easy to get internal approval' },
              { title: 'More efficient info sessions', desc: 'No need to bring multiple students to school events;\nTesuTemo videos do the talking' },
              { title: 'Stronger online pathways', desc: 'Add QR codes to pamphlets linking to student voice videos\nto drive prospective students online' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 ml-7 whitespace-pre-line">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real TesuTemo case study and client testimonial */}
      <section className="py-20 bg-gradient-to-b from-[#d4d9f0] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-2">
              Real TesuTemo Case Studies
            </h2>
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              and Client Testimonials
            </h2>
          </div>

          {/* Case study videos - green gradient carousel */}
          <div className="mb-16">
            <VideoCarousel
              videos={[
                v('1077851874', '4cc1f2e2a6'),
                v('1077854511', '4e8398acf7'),
                v('1077853072', '82e17e407b'),
              ]}
              gradient="from-[#a8d5ba] via-[#b8dfc8] to-[#98c5aa]"
            />
          </div>

          {/* Testimonial */}
          <div className="max-w-4xl mx-auto">
            {/* University Logo and Title */}
            <div className="flex items-center justify-center gap-6 mb-12">
              <Image src="/logo-kansai.png" alt="Kansai University" width={80} height={80} className="h-20 w-auto" />
              <div className="text-left border-l-2 border-gray-300 pl-6">
                <p className="text-lg text-gray-600 mb-1">Faculty & Graduate School Administrative Group</p>
                <p className="text-2xl font-semibold text-gray-900">Obuchi-san (Kansai University)</p>
              </div>
            </div>

            {/* Testimonial Quotes */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl p-8 border-l-4 border-primary shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  We hold faculty information sessions for affiliated schools and prospective students multiple times a year. It was a lot to ask students to come in for a 10-minute presentation each time, so we started using TesuTemo videos. Since professors also present before and after, we use their presentations for seminar and study abroad program overviews, and insert student voices in between to <span className="text-primary font-semibold">add variety and engagement to information sessions</span>.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-l-4 border-primary shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  We are also preparing to feature <span className="text-primary font-semibold">QR codes in our faculty pamphlets</span> for spring, on pages introducing seminar activities and study abroad programs. These will link to TesuTemo videos uploaded on our faculty website.
                </p>
              </div>

              <div className="bg-white rounded-2xl p-8 border-l-4 border-primary shadow-sm">
                <p className="text-gray-700 leading-relaxed">
                  By incorporating TesuTemo videos into our existing website, faculty pamphlets, and information session slides, we have been able to <span className="text-primary font-semibold">reduce the effort and cost</span> of arranging student speakers. It has been incredibly valuable for our team.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </SubpageLayout>
  );
}
