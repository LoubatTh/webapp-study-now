import { useSearchParams } from 'react-router-dom';

const QuizzPage = () => {

    const [searchParams] = useSearchParams();

    const idQuizze = searchParams.get("id");
    
    return (
      <>
        <div>Salut la team</div>
        <p>{idQuizze}</p>
      </>
    );
}

export default QuizzPage