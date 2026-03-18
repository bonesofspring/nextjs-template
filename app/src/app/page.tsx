import { styled } from '@linaria/react'

const Container = styled.div`
  align-items: center;
  background-color: #fff;
  display: flex;
  justify-content: center;
  min-height: 100vh;
  padding: 20px;
`

const Quote = styled.p`
  font-family: 'Fira Code', monospace;
  font-size: 24px;
  line-height: 1.6;
  margin: 0;
  max-width: 1000px;
  text-align: center;
`

const Home = () => (
  <Container>
    <Quote>
      &#39;постоянна только переменчивость; устойчива только смерть. каждое биение сердца ранит нас,
      и жизнь была бы сплошным кровотечением, если бы не существовало поэзии. она дает нам то, в чем
      отказала природа: золотое время, которое не ржавеет, весну, которая не отцветает, безоблачное
      счастье и вечную молодость&#39;
    </Quote>
  </Container>
)

export default Home
