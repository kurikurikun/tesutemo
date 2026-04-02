import type { Metadata } from 'next';
import SubpageLayout from '@/components/SubpageLayout';

export const metadata: Metadata = {
  title: 'Migration Promotion Videos & Resident Interview Videos | TesuTemo',
  description:
    'Interview videos of past migrants that resonate with potential relocators, delivering the real appeal of your region. An affordable migration promotion video service for local governments.',
  alternates: {
    canonical: 'https://www.tesutemo.co/en/municipality',
    languages: { ja: 'https://www.tesutemo.co/municipality' },
  },
};

const v = (id: string, h?: string) =>
  `https://player.vimeo.com/video/${id}?${h ? `h=${h}&` : ''}badge=0&autopause=0&player_id=0&app_id=58479`;

export default function MunicipalityPage() {
  return (
    <SubpageLayout
      locale="en"
      currentPath="/en/municipality"
      heroTitle={<>Attract more of the relocators you want with <span className="text-primary">real migrant voices.</span></>}
      heroSubtitle={
        <>
          <p className="italic text-gray-800 font-semibold mb-3">
            Let the residents who chose your region, convince the people considering it.
          </p>
          <p>
            <span className="text-primary font-semibold">Authentic</span>, <span className="text-primary font-semibold">affordable</span> migration promotion videos that resonate with the people you want to welcome.
          </p>
        </>
      }
      heroVideoUrl={v('1010426949', '34d0ad59fb')}
      problemHeading={<>Your message is out there.<br />But where are the migrants?</>}
      problemSubheading="Do any of these sound familiar?"
      problems={[
        "You'd love more quality migrant testimonials, but the budget just isn't there",
        'You have a migration website, but people never seem to find it',
        'You know you need to be on social media, but you never have content worth posting',
        "Your team is stretched thin, and consistent content creation just doesn't happen",
        'Your pamphlets reach people, but you want to turn that into online engagement',
      ]}
      problemConclusion={<>The result? Your region&rsquo;s true appeal goes unseen — and people who would have loved it end up moving somewhere else.</>}
      solutionTitle="TesuTemo lets real residents do the talking"
      solutionSubtitle={<>We interview migrants and community members and turn their genuine stories<br />into content that helps people picture themselves living in your region</>}
      solutionPoints={['Content that gives potential relocators a real feel for life in your community — and helps the right ones decide to make the move']}
      videoSectionTitle="When residents speak, people listen."
      videoSectionSubtitle="Interview Videos (Horizontal: 90–120 sec / Vertical: 30–60 sec)"
      videoHorizontalDesc={<>Horizontal videos go deep — perfect for your <span className="text-primary font-bold">migration website and relocation events</span></>}
      videoVerticalDesc={<>Vertical videos get you <span className="text-primary font-bold">discovered on social media</span></>}
      onlineFeatures={[
        { title: 'Residents film from wherever they are', desc: 'No studio, no stress. Residents speak to us on their own phone, in their own space — and the authenticity shows.' },
        { title: 'Pro-quality video, no crew required', desc: 'One free app, no login — residents just tap the call link we send. The tech handles audio and video quality automatically.' },
        { title: 'Built for the platforms relocators actually use', desc: 'Every video is cut and formatted for the feeds where potential new residents actually spend their time — ready to post, ready to perform.' },
      ]}
      horizontalVideos={[
        v('1010823028', '680857e13b'),
        v('1050610140', 'a5b8353977'),
      ]}
      verticalVideos={[
        v('1015054920', 'aa8a72196a'),
        v('1013400453', '89cb5fd807'),
        v('1050617850', '2e4031d8bd'),
      ]}
      companyLabel="Municipality"
      companyPlaceholder="City/Town name"
    >
      {/* How TesuTemo transforms your promotion efforts */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              The TesuTemo Effect. Here&rsquo;s What Changes.
            </h2>
            <p className="text-lg text-gray-600">Here&rsquo;s how TesuTemo transforms your outreach and migration promotion</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              { title: 'Ready-to-use video assets', desc: 'Receive vertical and horizontal videos ready to publish —\nperfect for social media, migration fairs, and events' },
              { title: 'Less work for your team', desc: 'Cut the time and energy your team spends\non content production — dramatically' },
              { title: 'Content that actually resonates', desc: 'Gen Z and Gen Alpha trust authentic peer voices far more\nthan polished promotional content' },
              { title: 'Easy to get budget sign-off', desc: 'Transparent, affordable pricing makes internal approval\nstraightforward' },
              { title: 'No travel, no on-site filming', desc: 'Everything is done remotely — keeping costs low\nregardless of where your residents live' },
              { title: 'Turn print into digital engagement', desc: 'Embed QR codes in pamphlets linking to resident voice videos\nto drive people toward consultations and visits' },
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
    </SubpageLayout>
  );
}
