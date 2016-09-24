React.createClass({ displayName: 'ComponentFormQuestion',

    buildElement: function() {
        var question = this.state.question;
        var label    = question.label || question.name;

        var element;
        switch (question.questionType) {
            case 'choice-single':
                var options = [];
                for (var i = 0; i < question.choices.length; i++) {
                    var choice = question.choices[i];
                    options.push(choice.option);
                }
                element = React.createElement(Radix.Components.get('FormSelect'), {
                    name    : question.key,
                    label   : label,
                    options : options
                });
                break;
            case 'textarea':
                element = React.createElement(Radix.Components.get('FormTextArea'), {
                    name    : question.key,
                    label   : label
                });
                break;
            default:
                element = React.createElement('p', null, label);
                break;
        }
        return element;
    },

    componentDidMount: function() {
        var url;
        if (this.props.tagKeyOrId) {
            url = '/app/question/tag/' + this.props.tagKeyOrId;
        } else if (this.props.keyOrId) {
            url = '/app/question/' + this.props.keyOrId;
        }
        if (!url) {
            Debugger.error('No question id, key, or tag provided for the question. Unable to retrieve question.');
            return;
        }

        Ajax.send(url, 'GET').then(
            function(response) {
                this.setState({ loaded: true, question: response.data });
            }.bind(this),
            function(jqXhr) {
                Debugger.error('Unable to load the question.');
            }.bind(this)
        );
    },

    getDefaultProps: function() {
        return {
            keyOrId: null,
            tagKeyOrId: null
        };
    },

    getInitialState: function() {
        return {
            loaded   : false,
            question : {}
        };
    },

    render: function() {
        var element = React.createElement('div');
        if (this.state.loaded) {
            element = this.buildElement();
        }
        return (element);
    }
});
