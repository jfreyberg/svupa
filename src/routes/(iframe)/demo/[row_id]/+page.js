export const prerender = false;
export const ssr = false;
export const load = ({ params }) => {
    return {
        row_id: params.row_id
    }
}
