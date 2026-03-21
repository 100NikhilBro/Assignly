// import { FileText, Users, TrendingUp, Brain } from "lucide-react";

// export default function StatsSection() {
//   return (
//     <section className="py-16 bg-white border-y border-gray-100">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
//           <div>
//             <div className="text-3xl md:text-4xl font-bold text-indigo-600">500+</div>
//             <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
//               <FileText className="w-3 h-3" />
//               Assignments Generated
//             </div>
//           </div>
//           <div>
//             <div className="text-3xl md:text-4xl font-bold text-indigo-600">98%</div>
//             <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
//               <Users className="w-3 h-3" />
//               Satisfaction Rate
//             </div>
//           </div>
//           <div>
//             <div className="text-3xl md:text-4xl font-bold text-indigo-600">10x</div>
//             <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
//               <TrendingUp className="w-3 h-3" />
//               Faster Creation
//             </div>
//           </div>
//           <div>
//             <div className="text-3xl md:text-4xl font-bold text-indigo-600">24/7</div>
//             <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
//               <Brain className="w-3 h-3" />
//               AI Support
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



import { FileText, Users, TrendingUp, Brain } from "lucide-react";

export default function StatsSection() {
  return (
    <section className="py-16 bg-white border-y border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">500+</div>
            <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
              <FileText className="w-3 h-3" />
              Assignments Generated
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">98%</div>
            <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
              <Users className="w-3 h-3" />
              Satisfaction Rate
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">10x</div>
            <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
              <TrendingUp className="w-3 h-3" />
              Faster Creation
            </div>
          </div>
          <div>
            <div className="text-3xl md:text-4xl font-bold text-indigo-600">24/7</div>
            <div className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1">
              <Brain className="w-3 h-3" />
              AI Support
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}