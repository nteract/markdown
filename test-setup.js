const enzyme = require("enzyme");
const Adapter = require("enzyme-adapter-react-16");

enzyme.configure({
    adapter: new Adapter()
});
window.URL.createObjectURL = function () {
    return "mocked"
}; //jest needs a mock for this, or tests that call this method won't work.