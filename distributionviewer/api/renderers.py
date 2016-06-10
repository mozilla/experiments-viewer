from rest_framework.renderers import JSONRenderer


class NamespaceJSONRenderer(JSONRenderer):
    "A JSON renderer that wraps the result data in a namespace"
    namespace = 'objects'

    def render(self, data, *args, **kwargs):
        data = {self.namespace: data}
        return super(NamespaceJSONRenderer, self).render(data, *args, **kwargs)


class DistributionJSONRenderer(NamespaceJSONRenderer):
    namespace = 'distributions'
