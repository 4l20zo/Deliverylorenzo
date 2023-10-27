import SanityClient from "@sanity/client";
import ImageUrlBuilder from "@sanity/image-url";
export const client = SanityClient({
    projectId: "vp1zc7ut",
    dataset: 'production',
    apiVersion: "2023-01-10",
    useCdn: true,
    token: "skvvmD52npJ7rCf6H8xzUVBWlRLqOpfTAWDSU3X1rRW4PqR7nm9HzVP75JcEVQSbPmxISYzk3oXUuT2FsQjr319wyhmxJknhZm1BEnkXCRjjK8K15DAZny09yXdFprLiyUdkL06NrMSsxQDPovYqYugNfCQCigG3FxZe3ScqUbxaSlLrDYFC",
    ignoreBrowserTokenWarning: true,
})

const builder = ImageUrlBuilder(client);

export const urlFor = (source) => builder.image(source)