// A file under an ignored path, such as a locally linked design system whose components implement the
// css prop themselves. Nothing here is transformed.
export function Card({ children }) {
    return <div css={{
        padding: 4
    }}>{children}</div>;
}
