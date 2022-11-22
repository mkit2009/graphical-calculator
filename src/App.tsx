import Canvas from "../components/Canvas/Canvas";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import GraphSidebar from "../components/GraphSidebar/GraphSidebar";
import styled from "@emotion/styled";

const StyledDiv = styled("div")`
  display: grid;
  grid-template-columns: 20% 60% 20%;
`;

function App() {
  return (
    <div className="App">
      <Navbar />
      <StyledDiv>
        <GraphSidebar />
        <main className="mx-auto flex items-center">
          <Canvas />
        </main>
        <div></div>
      </StyledDiv>
      <Footer />
    </div>
  );
}

export default App;
