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
      heroTitle={<>Attract more of the applicants you want with <span className="text-primary">real student voices.</span></>}
      heroSubtitle={
        <>
          <p className="italic text-gray-800 font-semibold mb-3">
            Let the students who chose you, convince the students considering you.
          </p>
          <p>
            <span className="text-primary font-semibold">Authentic</span>, <span className="text-primary font-semibold">affordable</span> promotion videos that resonate with the students you want to reach.
          </p>
        </>
      }
      heroVideoUrl={v('1017754838', '2df374323e')}
      problemHeading={<>Your message is out there.<br />But where are the students?</>}
      problemSubheading="Do any of these sound familiar?"
      problems={[
        "You'd love more quality student testimonials, but the budget just isn't there",
        'You have a department website, but prospective students never seem to find it',
        'You know you need to be on social media, but you never have content worth posting',
        "Faculty want to promote their programs, but they're too busy to make it happen",
        'Your pamphlets reach people, but you want to turn that into online engagement',
      ]}
      problemConclusion={<>The result? Your university&rsquo;s best qualities go unseen — and the right students end up choosing somewhere else.</>}
      solutionTitle="TesuTemo lets real students do the talking"
      solutionSubtitle={<>We interview your current and former students and turn their genuine experiences<br />into content that actually moves prospective students to act</>}
      solutionPoints={['Content that gives prospective students a real feel for campus life — and helps them decide your university is the right fit']}
      videoSectionTitle="When students speak, applicants listen"
      videoSectionSubtitle="Interview Videos (Horizontal: 90–120 sec / Vertical: 30–60 sec)"
      videoHorizontalDesc={<>Horizontal videos go deep — perfect for your university website and <span className="text-primary font-bold">open day presentations</span></>}
      videoVerticalDesc={<>Vertical videos get you <span className="text-primary font-bold">discovered on social media</span></>}
      onlineFeatures={[
        { title: 'Students film from wherever they are', desc: 'No studio, no stress. Students speak to us on their own phone, in their own space — and the authenticity shows.' },
        { title: 'Pro-quality video, no crew required', desc: 'One free app, no login — students just tap the call link we send. The tech handles audio and video quality automatically.' },
        { title: 'Built for the platforms students actually use', desc: 'Every video is cut and formatted for the feeds where prospective students actually spend their time — ready to post, ready to perform.' },
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
              The TesuTemo Effect. Here&rsquo;s What Changes.
            </h2>
            <p className="text-lg text-gray-600">Here&rsquo;s how TesuTemo transforms your outreach and student recruitment</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Ready-to-use video assets', desc: 'Receive vertical and horizontal videos ready to publish —\nperfect for social media and open day presentations' },
              { title: 'Less work for your team', desc: 'Dramatically cut the time and energy your team spends\non content production' },
              { title: 'Content that actually resonates', desc: 'Gen Z and Gen Alpha trust authentic peer voices far more\nthan polished institutional content' },
              { title: 'Easy to get budget sign-off', desc: 'Transparent, affordable pricing makes internal approval\nstraightforward' },
              { title: 'Streamline your info sessions', desc: 'No need to arrange student speakers for every event —\nTesuTemo videos handle it' },
              { title: 'Turn print into digital engagement', desc: 'Add QR codes to pamphlets that link straight to student\nvoice videos and drive prospective students online' },
            ].map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-4 h-4 bg-primary rounded-full flex-shrink-0 mt-1" />
                  <h3 className="text-lg font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-gray-600 ml-7">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real TesuTemo case study and client testimonial */}
      <section className="py-20 bg-gradient-to-b from-[#d4d9f0] to-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800">
              Real Results from Real Clients
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
                <p className="text-lg text-gray-600 mb-1">Kansai University Undergraduate & Graduate School Division</p>
                <p className="text-2xl font-semibold text-gray-900">OBUCHI Yuko</p>
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
