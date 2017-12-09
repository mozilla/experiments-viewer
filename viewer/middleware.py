def CORSMiddleware(get_response):
    def middleware(request):
        response = get_response(request)

        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Methods'] = 'GET, HEAD, OPTIONS'
        response['Access-Control-Allow-Headers'] = 'Authorization, Content-Type'

        return response

    return middleware
