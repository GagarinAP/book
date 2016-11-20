(function(){

	var app = app || {};

	app.Mod = Backbone.Model.extend({
		parse: function(response){
			response.id = response._id;
			return response;
		}
	});

	app.Col = Backbone.Collection.extend({
		model: app.Mod,
		url:'/api/books'
	});

	app.BookView = Backbone.View.extend({
		tagname: 'div',
		className: 'bookContainer',		
		template: _.template($('#bookTemplate').html()),
		events: {
			'click .delete': 'deleteBook'
		},
		initialize: function(){						
			this.listenTo(this.model, 'destroy', this.remove);
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		deleteBook: function(){
			this.model.destroy();
			this.model.remove();			
		}
	});

	app.BooksView = Backbone.View.extend({
		el: '#books',
		collection: new app.Col(),
		initialize: function(){				
			this.listenTo(this.collection, 'update', this.render);		
			this.collection.fetch();					
		},
		render: function(){
			this.collection.each(function(item){
				this.renderBook(item);
			}, this);
		},
		renderBook: function(item){
			var bookView = new app.BookView({
				model: item
			});
			this.$el.append(bookView.render().el);
		}
	});

	$(function(){
		window.apps = new app.BooksView();
	});
})();