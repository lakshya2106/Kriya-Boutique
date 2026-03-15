// import { PageLoader, WhatsAppFloat } from './components/FloatingButtons'
// import Cursor from './components/Cursor'
// import Navbar from './components/Navbar'
// import Hero from './components/Hero'
// import DressCard from './components/DressCard'
// import Collections from './components/Collections'
// import About from './components/About'
// import Testimonials from './components/Testimonials'
// import InstagramGallery from './components/InstagramGallery'
// import Contact from './components/Contact'
// import { Marquee, Intro, Quote, Process, Footer } from './components/Sections'
// import { useDresses, useBrand } from './hooks/useAPI'

// export default function App() {
//   const { data: brand }      = useBrand()
//   const { data: rawDresses } = useDresses()
//   const dresses = Array.isArray(rawDresses) ? rawDresses : []

//   // Featured = new + bestseller, max 3
//   const featured = dresses
//     .filter(d => d.badge === 'new' || d.badge === 'bestseller')
//     .slice(0, 3)

//   // Process steps come from brand settings (stored as JSON array in DB)
//   const processSteps = Array.isArray(brand?.processSteps) ? brand.processSteps : []

//   return (
//     <>
//       <PageLoader />
//       <WhatsAppFloat />
//       <Cursor />
//       <Navbar />
//       <Hero />
//       <Marquee />
//       <Intro />

//       {/* Featured dress cards */}
//       {featured.length > 0 && (
//         <section id="featured">
//           {featured.map((dress, i) => (
//             <DressCard key={dress._id || dress.id} dress={dress} index={i} />
//           ))}
//         </section>
//       )}

//       <Collections />
//       <About />
//       <Process steps={processSteps} />
//       <Quote />
//       <Testimonials />
//       <InstagramGallery />
//       <Contact />
//       <Footer brand={brand || {}} />
//     </>
//   )
// }





import { PageLoader, WhatsAppFloat } from './components/FloatingButtons'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import DressCard from './components/DressCard'
import Collections from './components/Collections'
import About from './components/About'
import Testimonials from './components/Testimonials'
import InstagramGallery from './components/InstagramGallery'
import Contact from './components/Contact'
import { Marquee, Intro, Quote, Process, Footer } from './components/Sections'
import { useDresses, useBrand } from './hooks/useAPI'

export default function App() {
  const { data: brand }      = useBrand()
  const { data: rawDresses } = useDresses()
  const dresses = Array.isArray(rawDresses) ? rawDresses : []

  // Showcase = dresses explicitly marked by admin
  const featured = dresses.filter(d => d.showcase)

  // Process steps come from brand settings
  const processSteps = Array.isArray(brand?.processSteps) ? brand.processSteps : []

  return (
    <>
      <PageLoader />
      <WhatsAppFloat />
      <Cursor />
      <Navbar />
      <Hero />
      <Marquee />
      <Intro />

      {featured.length > 0 && (
        <section id="featured">
          {featured.map((dress, i) => (
            <DressCard key={dress._id || dress.id} dress={dress} index={i} />
          ))}
        </section>
      )}

      <Collections />
      <About />
      <Process steps={processSteps} />
      <Quote />
      <Testimonials />
      <InstagramGallery />
      <Contact />
      <Footer brand={brand || {}} />
    </>
  )
}