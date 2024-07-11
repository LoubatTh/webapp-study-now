import PageTitle from '@/components/pageTitle'
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { BookMarked, CheckCircle, Star, StarsIcon, XCircle } from 'lucide-react';

const advantages = [
    { name: "Advantage 1", basic: true, premium: true },
    { name: "Advantage 2", basic: true, premium: true },
    { name: "Advantage 3", basic: true, premium: true },
    { name: "Advantage 4", basic: false, premium: true },
    { name: "Advantage 5", basic: false, premium: true },
    { name: "Advantage 6", basic: false, premium: true },
    { name: "Advantage 7", basic: false, premium: true },
    { name: "Advantage 8", basic: false, premium: true },
    { name: "Advantage 9", basic: false, premium: true },
    { name: "Advantage 10", basic: false, premium: true },

]

const premiumColorClass = "blue-500";

const PremiumPage = () => {
  return (
    <>
      <PageTitle title="Subscriptions plans" />

      <div className="flex justify-center p-6">
        <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 md:w-auto">
          {/* BASIC SUBSCRIPTION */}

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, delay: 0.2 }}
          >
            <Card className="shadow-2xl transition-all border-3 border-white h-min hover:-translate-y-2">
              <CardHeader>
                <CardTitle className="flex gap-1 text-base">
                  <BookMarked size={24} /> Basic
                </CardTitle>

                <CardTitle className="font-bold tracking-wide">Free</CardTitle>

                <CardTitle className="font-base text-base">
                  For those who want to have fun learning{" "}
                </CardTitle>
              </CardHeader>

              <CardContent className="bg-white rounded-b-lg">
                <ul>
                  {advantages.map((advantage, index) => (
                    <li
                      key={index}
                      className={clsx("flex items-center gap-2 pb-2")}
                    >
                      {advantage.basic ? (
                        <>
                          <CheckCircle size={16} />
                          <span> {advantage.name} </span>
                        </>
                      ) : (
                        <>
                          <XCircle size={16} className="text-gray-400" />
                          <span className="text-gray-400">
                            {advantage.name}
                          </span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>

                <Button className="mt-5 w-full">Get Started</Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* PREMIUM SUBSCRIPTION */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", duration: 0.5, delay: 0.5 }}
          >
            <Card
              className={cn(
                "shadow-2xl transition-all hover:-translate-y-2 border-2 border-white hover:border-blue-400"
              )}
            >
              <CardHeader>
                <CardTitle
                  className={cn(
                    "flex gap-1 text-base text-" + premiumColorClass
                  )}
                >
                  <StarsIcon size={24} /> Premium
                </CardTitle>

                <CardTitle className="font-bold tracking-wide">
                  7.99€ <span className="text-sm">/per month</span>
                </CardTitle>

                <CardTitle className="font-base text-base">
                  For gods in search of omniscience
                </CardTitle>
              </CardHeader>

              <CardContent className="bg-white rounded-b-lg">
                <ul>
                  {advantages.map((advantage, index) => (
                    <li
                      key={index}
                      className={clsx("flex items-center gap-2 pb-2")}
                    >
                      <CheckCircle
                        className={cn("text-" + premiumColorClass)}
                        size={16}
                      />
                      <span>{advantage.name}</span>
                    </li>
                  ))}
                </ul>

                <Button className={cn("mt-5 w-full")}>Subscribe</Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
}

export default PremiumPage