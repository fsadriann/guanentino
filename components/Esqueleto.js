export default function Esqueleto({ className = "" }) {
    return <div aria-hidden="true" className={"esqueleto " + className} />;
}