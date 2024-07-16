import PageTitle from '@/components/pageTitle';
import QuizzDeckCard from '@/components/quizzDeckCard';
import { useAuth } from '@/contexts/AuthContext';
import { cardVariants } from '@/lib/animations/cardVariants';
import { Deck } from '@/types/deck.type';
import { Quizz } from '@/types/quizz.type';
import { fetchApi } from '@/utils/api';
import { motion, MotionConfig } from 'framer-motion';
import React, { useEffect, useState } from 'react'
import { set } from 'react-hook-form';
import { useParams, useSearchParams } from 'react-router-dom';
import ReactLoading from "react-loading";
import { Organization } from '@/types/organization.type';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

const BoardOrganizationPage= () => {
    
    const { accessToken, isReady } = useAuth();
    const { id } = useUser();
    const { organizationId } = useParams();
    const [ organization, setOrganization] = useState<Organization>();
    const [decks, setDecks] = useState<Deck[]>([]);
    const [quizzes, setQuizzes] = useState<Quizz[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if(!isReady) return;

      const fetchData = async () => {
        //Get Organization
        let response = await fetchApi("GET",`organizations/${organizationId}`,null,accessToken);
        const organization = (await response.data);
        
        //Get Quizzes
        response = await fetchApi("GET",`organizations/${organizationId}/quizzes`,null,accessToken);
        const quizzes = (await response.data) as Quizz[];

        //Get Decks
        response = await fetchApi("GET",`organizations/${organizationId}/decks`,null,accessToken);
        const decks = (await response.data) as Deck[];

        setOrganization(organization);
        setQuizzes(quizzes);
        setDecks(decks);
        setLoading(false);
      };

      fetchData();
    }, [isReady]);

    if(loading){
      return (
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="text-center">
            <ReactLoading type={"spin"} color={"#2563EB"} />
          </div>
        </div>
      );
    }

    if(quizzes.length == 0 && decks.length == 0) {  
      return (
        <div className="flex-grow flex flex-col items-center justify-center">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-blue-400">Sorry !</h1>
            <p className="text-2xl text-gray-600 mt-4">
              This organization doesn't have any quizzes or decks
            </p>
            <div className='flex justify-center gap-2 mt-4'>
              {organization?.owner_id === id ? (
                <>
                  <Button>
                    Create Quizz
                  </Button>
                  <Button>
                    Create Deck
                  </Button>
                </>
              ): ("")}
              </div>
          </div>
        </div>
      );
    }
   

    return (
      <>
        <PageTitle title={organization?.name + "'s board"} />
        <p className="text-center">{organization?.description}</p>


        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
          {quizzes.map((quizz, index) => (
            <QuizzDeckCard
              key={index}
              id={quizz.quiz.id}
              name={quizz.quiz.name}
              tag={quizz.quiz.tag}
              likes={quizz.quiz.likes}
              type={quizz.quiz.type}
              is_public={quizz.quiz.is_public}
              is_organization={quizz.quiz.is_organization}
            />
          ))}

        </div>
      </>
    );
}

export default BoardOrganizationPage
