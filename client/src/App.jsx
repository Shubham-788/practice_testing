import Counter from "./components/Counter";
import MessageBox from "./components/MessageBox";
function App() {
  // const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <Counter />
        <br/>
        <MessageBox/>
      </div>
    </>
  );
}
export default App;
