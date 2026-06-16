package com.example.bloglab

import android.app.Activity
import android.app.AlertDialog
import android.content.Context
import android.content.SharedPreferences
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.text.Editable
import android.text.InputType
import android.text.TextWatcher
import android.view.Gravity
import android.view.View
import android.view.ViewGroup
import android.widget.AdapterView
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.LinearLayout
import android.widget.ScrollView
import android.widget.Spinner
import android.widget.TextView
import android.widget.Toast
import org.json.JSONArray
import org.json.JSONObject
import java.security.MessageDigest
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.UUID
import kotlin.math.roundToInt

data class BlogUser(
    val username: String,
    val passwordHash: String
)

data class BlogComment(
    val id: String,
    val author: String,
    val text: String,
    val createdAt: Long
)

data class Article(
    val id: String,
    val title: String,
    val content: String,
    val category: String,
    val author: String,
    val createdAt: Long,
    val updatedAt: Long,
    val comments: List<BlogComment>
)

class MainActivity : Activity() {
    private lateinit var store: BlogStore
    private var selectedCategory = ALL_CATEGORIES
    private var searchQuery = ""

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        store = BlogStore(this)
        window.statusBarColor = Color.parseColor("#F7F7FB")

        if (store.currentUser().isNullOrBlank()) {
            showAuthScreen()
        } else {
            showBlogScreen()
        }
    }

    private fun showAuthScreen() {
        val root = verticalLayout().apply {
            setPadding(dp(24), dp(38), dp(24), dp(24))
            setBackgroundColor(Color.parseColor("#F7F7FB"))
            gravity = Gravity.CENTER_HORIZONTAL
        }

        root.addView(titleText("Blog Lab"))
        root.addView(subtitleText("Авторизуйтесь або створіть локальний акаунт"))

        val usernameInput = formInput("Ім'я користувача").apply {
            setSingleLine(true)
        }
        val passwordInput = formInput("Пароль").apply {
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_VARIATION_PASSWORD
            setSingleLine(true)
        }

        root.addView(usernameInput)
        root.addView(passwordInput)

        val loginButton = primaryButton("Увійти")
        val registerButton = secondaryButton("Зареєструватися")

        loginButton.setOnClickListener {
            val username = usernameInput.text.toString().trim()
            val password = passwordInput.text.toString()

            if (username.isBlank() || password.isBlank()) {
                toast("Заповніть ім'я користувача та пароль")
                return@setOnClickListener
            }

            if (store.login(username, password)) {
                searchQuery = ""
                selectedCategory = ALL_CATEGORIES
                showBlogScreen()
            } else {
                toast("Невірне ім'я користувача або пароль")
            }
        }

        registerButton.setOnClickListener {
            val username = usernameInput.text.toString().trim()
            val password = passwordInput.text.toString()

            if (username.length < 3 || password.length < 4) {
                toast("Ім'я має містити 3 символи, пароль - 4")
                return@setOnClickListener
            }

            when (store.register(username, password)) {
                RegisterResult.SUCCESS -> {
                    toast("Акаунт створено")
                    searchQuery = ""
                    selectedCategory = ALL_CATEGORIES
                    showBlogScreen()
                }
                RegisterResult.USER_EXISTS -> toast("Такий користувач уже існує")
            }
        }

        root.addView(loginButton)
        root.addView(registerButton)

        setContentView(root)
    }

    private fun showBlogScreen() {
        val currentUser = store.currentUser() ?: return showAuthScreen()
        val root = verticalLayout().apply {
            setPadding(dp(14), dp(22), dp(14), dp(10))
            setBackgroundColor(Color.parseColor("#F7F7FB"))
        }

        val header = horizontalLayout().apply {
            gravity = Gravity.CENTER_VERTICAL
        }
        val headerTexts = verticalLayout().apply {
            layoutParams = LinearLayout.LayoutParams(0, ViewGroup.LayoutParams.WRAP_CONTENT, 1f)
        }
        headerTexts.addView(titleText("Блог").apply {
            textSize = 28f
            setPadding(0, 0, 0, dp(2))
        })
        headerTexts.addView(subtitleText("Користувач: $currentUser").apply {
            setPadding(0, 0, 0, 0)
        })
        header.addView(headerTexts)

        val logoutButton = compactButton("Вийти")
        logoutButton.setOnClickListener {
            store.logout()
            showAuthScreen()
        }
        header.addView(logoutButton)
        root.addView(header)

        val searchInput = formInput("Пошук за назвою, текстом або коментарями").apply {
            setText(searchQuery)
            setSingleLine(true)
        }
        root.addView(searchInput)

        val categories = listOf(ALL_CATEGORIES) + store.categories()
        if (selectedCategory !in categories) {
            selectedCategory = ALL_CATEGORIES
        }

        val controls = horizontalLayout().apply {
            gravity = Gravity.CENTER_VERTICAL
        }
        val spinner = Spinner(this).apply {
            adapter = ArrayAdapter(
                this@MainActivity,
                android.R.layout.simple_spinner_item,
                categories
            ).also {
                it.setDropDownViewResource(android.R.layout.simple_spinner_dropdown_item)
            }
            setSelection(categories.indexOf(selectedCategory))
            layoutParams = LinearLayout.LayoutParams(0, dp(48), 1f).apply {
                setMargins(0, 0, dp(10), 0)
            }
        }
        val addButton = primaryButton("Нова стаття").apply {
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.WRAP_CONTENT,
                dp(48)
            )
        }

        controls.addView(spinner)
        controls.addView(addButton)
        root.addView(controls)

        val articleContainer = verticalLayout()
        val scroll = ScrollView(this).apply {
            addView(articleContainer)
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                0,
                1f
            )
        }
        root.addView(scroll)

        fun refreshList() {
            renderArticles(articleContainer)
        }

        searchInput.addTextChangedListener(object : TextWatcher {
            override fun beforeTextChanged(s: CharSequence?, start: Int, count: Int, after: Int) = Unit
            override fun onTextChanged(s: CharSequence?, start: Int, before: Int, count: Int) = Unit
            override fun afterTextChanged(s: Editable?) {
                searchQuery = s?.toString().orEmpty()
                refreshList()
            }
        })

        spinner.onItemSelectedListener = object : AdapterView.OnItemSelectedListener {
            override fun onItemSelected(parent: AdapterView<*>?, view: View?, position: Int, id: Long) {
                selectedCategory = categories[position]
                refreshList()
            }

            override fun onNothingSelected(parent: AdapterView<*>?) = Unit
        }

        addButton.setOnClickListener {
            showArticleEditor(null)
        }

        setContentView(root)
        refreshList()
    }

    private fun renderArticles(container: LinearLayout) {
        container.removeAllViews()

        val query = searchQuery.trim().lowercase(Locale.getDefault())
        val articles = store.loadArticles()
            .filter { selectedCategory == ALL_CATEGORIES || it.category == selectedCategory }
            .filter { article ->
                query.isBlank() ||
                    article.title.lowercase(Locale.getDefault()).contains(query) ||
                    article.content.lowercase(Locale.getDefault()).contains(query) ||
                    article.category.lowercase(Locale.getDefault()).contains(query) ||
                    article.comments.any { it.text.lowercase(Locale.getDefault()).contains(query) }
            }
            .sortedByDescending { it.updatedAt }

        if (articles.isEmpty()) {
            container.addView(emptyStateText("Статей не знайдено"))
            return
        }

        articles.forEach { article ->
            container.addView(articleCard(article))
        }
    }

    private fun articleCard(article: Article): View {
        val currentUser = store.currentUser().orEmpty()
        val card = verticalLayout().apply {
            setPadding(dp(14), dp(12), dp(14), dp(12))
            background = roundedBackground("#FFFFFF", "#D8DFEA")
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                ViewGroup.LayoutParams.WRAP_CONTENT
            ).apply {
                setMargins(0, dp(8), 0, dp(8))
            }
        }

        card.addView(TextView(this).apply {
            text = article.title
            textSize = 20f
            setTypeface(Typeface.DEFAULT, Typeface.BOLD)
            setTextColor(Color.parseColor("#1E293B"))
        })

        card.addView(TextView(this).apply {
            text = "${article.category} | ${article.author} | ${formatDate(article.updatedAt)}"
            textSize = 13f
            setTextColor(Color.parseColor("#64748B"))
            setPadding(0, dp(4), 0, dp(8))
        })

        card.addView(TextView(this).apply {
            text = article.content
            textSize = 15f
            setTextColor(Color.parseColor("#243244"))
            setLineSpacing(0f, 1.12f)
        })

        card.addView(TextView(this).apply {
            text = "Коментарі (${article.comments.size})"
            textSize = 15f
            setTypeface(Typeface.DEFAULT, Typeface.BOLD)
            setTextColor(Color.parseColor("#334155"))
            setPadding(0, dp(12), 0, dp(4))
        })

        if (article.comments.isEmpty()) {
            card.addView(TextView(this).apply {
                text = "Поки немає коментарів"
                textSize = 13f
                setTextColor(Color.parseColor("#64748B"))
            })
        } else {
            article.comments.sortedBy { it.createdAt }.forEach { comment ->
                card.addView(TextView(this).apply {
                    text = "${comment.author}: ${comment.text}\n${formatDate(comment.createdAt)}"
                    textSize = 13f
                    setTextColor(Color.parseColor("#334155"))
                    setPadding(dp(10), dp(7), dp(10), dp(7))
                    background = roundedBackground("#F8FAFC", "#E2E8F0")
                    layoutParams = LinearLayout.LayoutParams(
                        ViewGroup.LayoutParams.MATCH_PARENT,
                        ViewGroup.LayoutParams.WRAP_CONTENT
                    ).apply {
                        setMargins(0, dp(4), 0, dp(4))
                    }
                })
            }
        }

        val actions = horizontalLayout().apply {
            gravity = Gravity.CENTER_VERTICAL
            setPadding(0, dp(10), 0, 0)
        }

        val commentButton = compactButton("Коментар")
        commentButton.setOnClickListener {
            showCommentDialog(article)
        }
        actions.addView(commentButton)

        if (article.author == currentUser) {
            val editButton = compactButton("Редагувати")
            editButton.setOnClickListener {
                showArticleEditor(article)
            }
            actions.addView(editButton)

            val deleteButton = compactButton("Видалити")
            deleteButton.setOnClickListener {
                confirmDelete(article)
            }
            actions.addView(deleteButton)
        }

        card.addView(actions)
        return card
    }

    private fun showArticleEditor(article: Article?) {
        val currentUser = store.currentUser() ?: return
        val now = System.currentTimeMillis()

        val form = verticalLayout().apply {
            setPadding(dp(18), dp(8), dp(18), 0)
        }
        val titleInput = formInput("Назва статті").apply {
            setText(article?.title.orEmpty())
            setSingleLine(true)
        }
        val categoryInput = formInput("Категорія").apply {
            setText(article?.category ?: store.categories().firstOrNull().orEmpty())
            setSingleLine(true)
        }
        val contentInput = formInput("Текст статті").apply {
            setText(article?.content.orEmpty())
            minLines = 5
            gravity = Gravity.TOP
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(150)
            ).apply {
                setMargins(0, dp(8), 0, dp(8))
            }
        }

        form.addView(titleInput)
        form.addView(categoryInput)
        form.addView(contentInput)

        val dialog = AlertDialog.Builder(this)
            .setTitle(if (article == null) "Нова стаття" else "Редагування статті")
            .setView(ScrollView(this).apply { addView(form) })
            .setNegativeButton("Скасувати", null)
            .setPositiveButton("Зберегти", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val title = titleInput.text.toString().trim()
                val category = categoryInput.text.toString().trim()
                val content = contentInput.text.toString().trim()

                if (title.isBlank() || category.isBlank() || content.isBlank()) {
                    toast("Заповніть назву, категорію та текст")
                    return@setOnClickListener
                }

                val savedArticle = article?.copy(
                    title = title,
                    category = category,
                    content = content,
                    updatedAt = now
                ) ?: Article(
                    id = UUID.randomUUID().toString(),
                    title = title,
                    content = content,
                    category = category,
                    author = currentUser,
                    createdAt = now,
                    updatedAt = now,
                    comments = emptyList()
                )

                store.saveArticle(savedArticle)
                dialog.dismiss()
                showBlogScreen()
            }
        }

        dialog.show()
    }

    private fun showCommentDialog(article: Article) {
        val currentUser = store.currentUser() ?: return
        val input = formInput("Ваш коментар").apply {
            minLines = 3
            gravity = Gravity.TOP
            inputType = InputType.TYPE_CLASS_TEXT or InputType.TYPE_TEXT_FLAG_MULTI_LINE
            layoutParams = LinearLayout.LayoutParams(
                ViewGroup.LayoutParams.MATCH_PARENT,
                dp(110)
            ).apply {
                setMargins(0, dp(8), 0, dp(8))
            }
        }

        val dialog = AlertDialog.Builder(this)
            .setTitle("Коментар до статті")
            .setView(verticalLayout().apply {
                setPadding(dp(18), dp(8), dp(18), 0)
                addView(input)
            })
            .setNegativeButton("Скасувати", null)
            .setPositiveButton("Додати", null)
            .create()

        dialog.setOnShowListener {
            dialog.getButton(AlertDialog.BUTTON_POSITIVE).setOnClickListener {
                val text = input.text.toString().trim()
                if (text.isBlank()) {
                    toast("Коментар не може бути порожнім")
                    return@setOnClickListener
                }

                store.addComment(
                    article.id,
                    BlogComment(
                        id = UUID.randomUUID().toString(),
                        author = currentUser,
                        text = text,
                        createdAt = System.currentTimeMillis()
                    )
                )
                dialog.dismiss()
                showBlogScreen()
            }
        }

        dialog.show()
    }

    private fun confirmDelete(article: Article) {
        AlertDialog.Builder(this)
            .setTitle("Видалити статтю?")
            .setMessage(article.title)
            .setNegativeButton("Скасувати", null)
            .setPositiveButton("Видалити") { _, _ ->
                store.deleteArticle(article.id)
                showBlogScreen()
            }
            .show()
    }

    private fun titleText(value: String): TextView = TextView(this).apply {
        text = value
        textSize = 32f
        setTypeface(Typeface.DEFAULT, Typeface.BOLD)
        setTextColor(Color.parseColor("#172033"))
        setPadding(0, 0, 0, dp(8))
    }

    private fun subtitleText(value: String): TextView = TextView(this).apply {
        text = value
        textSize = 14f
        setTextColor(Color.parseColor("#64748B"))
        setPadding(0, 0, 0, dp(18))
    }

    private fun emptyStateText(value: String): TextView = TextView(this).apply {
        text = value
        textSize = 16f
        gravity = Gravity.CENTER
        setTextColor(Color.parseColor("#64748B"))
        setPadding(0, dp(48), 0, 0)
    }

    private fun formInput(hintText: String): EditText = EditText(this).apply {
        hint = hintText
        textSize = 15f
        setSingleLine(false)
        setTextColor(Color.parseColor("#172033"))
        setHintTextColor(Color.parseColor("#94A3B8"))
        background = roundedBackground("#FFFFFF", "#CBD5E1")
        setPadding(dp(12), 0, dp(12), 0)
        layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            dp(50)
        ).apply {
            setMargins(0, dp(8), 0, dp(8))
        }
    }

    private fun primaryButton(value: String): Button = Button(this).apply {
        text = value
        isAllCaps = false
        textSize = 14f
        setTextColor(Color.WHITE)
        background = roundedBackground("#2F6FED", "#2F6FED")
        layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            dp(48)
        ).apply {
            setMargins(0, dp(8), 0, 0)
        }
    }

    private fun secondaryButton(value: String): Button = Button(this).apply {
        text = value
        isAllCaps = false
        textSize = 14f
        setTextColor(Color.parseColor("#2F6FED"))
        background = roundedBackground("#FFFFFF", "#B8C7E8")
        layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            dp(48)
        ).apply {
            setMargins(0, dp(8), 0, 0)
        }
    }

    private fun compactButton(value: String): Button = Button(this).apply {
        text = value
        isAllCaps = false
        textSize = 12f
        minHeight = 0
        minimumHeight = 0
        minWidth = 0
        minimumWidth = 0
        setPadding(dp(10), 0, dp(10), 0)
        setTextColor(Color.parseColor("#1F4FBF"))
        background = roundedBackground("#EEF4FF", "#C7D7FE")
        layoutParams = LinearLayout.LayoutParams(
            ViewGroup.LayoutParams.WRAP_CONTENT,
            dp(40)
        ).apply {
            setMargins(0, 0, dp(8), 0)
        }
    }

    private fun verticalLayout(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.VERTICAL
    }

    private fun horizontalLayout(): LinearLayout = LinearLayout(this).apply {
        orientation = LinearLayout.HORIZONTAL
    }

    private fun roundedBackground(fill: String, stroke: String): GradientDrawable {
        return GradientDrawable().apply {
            shape = GradientDrawable.RECTANGLE
            cornerRadius = dp(8).toFloat()
            setColor(Color.parseColor(fill))
            setStroke(dp(1), Color.parseColor(stroke))
        }
    }

    private fun dp(value: Int): Int {
        return (value * resources.displayMetrics.density).roundToInt()
    }

    private fun formatDate(timestamp: Long): String {
        return SimpleDateFormat("dd.MM.yyyy HH:mm", Locale.getDefault()).format(Date(timestamp))
    }

    private fun toast(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }

    companion object {
        private const val ALL_CATEGORIES = "Усі категорії"
    }
}

enum class RegisterResult {
    SUCCESS,
    USER_EXISTS
}

class BlogStore(context: Context) {
    private val prefs: SharedPreferences =
        context.getSharedPreferences("blog_lab_storage", Context.MODE_PRIVATE)

    fun currentUser(): String? = prefs.getString(KEY_CURRENT_USER, null)

    fun register(username: String, password: String): RegisterResult {
        val normalized = username.trim()
        val users = loadUsers()

        if (users.any { it.username.equals(normalized, ignoreCase = true) }) {
            return RegisterResult.USER_EXISTS
        }

        users.add(BlogUser(normalized, password.sha256()))
        saveUsers(users)
        prefs.edit().putString(KEY_CURRENT_USER, normalized).apply()
        return RegisterResult.SUCCESS
    }

    fun login(username: String, password: String): Boolean {
        val normalized = username.trim()
        val user = loadUsers().firstOrNull { it.username.equals(normalized, ignoreCase = true) }
        val isValid = user?.passwordHash == password.sha256()

        if (isValid) {
            prefs.edit().putString(KEY_CURRENT_USER, user.username).apply()
        }

        return isValid
    }

    fun logout() {
        prefs.edit().remove(KEY_CURRENT_USER).apply()
    }

    fun categories(): List<String> {
        val defaults = listOf("Навчання", "Технології", "Подорожі", "Нотатки")
        return (defaults + loadArticles().map { it.category })
            .map { it.trim() }
            .filter { it.isNotBlank() }
            .distinctBy { it.lowercase(Locale.getDefault()) }
            .sorted()
    }

    fun loadArticles(): MutableList<Article> {
        val articles = mutableListOf<Article>()
        val array = JSONArray(prefs.getString(KEY_ARTICLES, "[]") ?: "[]")

        for (i in 0 until array.length()) {
            val item = array.optJSONObject(i) ?: continue
            val commentsArray = item.optJSONArray("comments") ?: JSONArray()
            val comments = mutableListOf<BlogComment>()

            for (j in 0 until commentsArray.length()) {
                val comment = commentsArray.optJSONObject(j) ?: continue
                comments.add(
                    BlogComment(
                        id = comment.optString("id"),
                        author = comment.optString("author"),
                        text = comment.optString("text"),
                        createdAt = comment.optLong("createdAt")
                    )
                )
            }

            articles.add(
                Article(
                    id = item.optString("id"),
                    title = item.optString("title"),
                    content = item.optString("content"),
                    category = item.optString("category"),
                    author = item.optString("author"),
                    createdAt = item.optLong("createdAt"),
                    updatedAt = item.optLong("updatedAt"),
                    comments = comments
                )
            )
        }

        return articles
    }

    fun saveArticle(article: Article) {
        val articles = loadArticles()
        val index = articles.indexOfFirst { it.id == article.id }

        if (index >= 0) {
            articles[index] = article
        } else {
            articles.add(article)
        }

        saveArticles(articles)
    }

    fun deleteArticle(articleId: String) {
        saveArticles(loadArticles().filterNot { it.id == articleId })
    }

    fun addComment(articleId: String, comment: BlogComment) {
        val articles = loadArticles()
        val index = articles.indexOfFirst { it.id == articleId }

        if (index >= 0) {
            val article = articles[index]
            articles[index] = article.copy(
                updatedAt = System.currentTimeMillis(),
                comments = article.comments + comment
            )
            saveArticles(articles)
        }
    }

    private fun loadUsers(): MutableList<BlogUser> {
        val users = mutableListOf<BlogUser>()
        val array = JSONArray(prefs.getString(KEY_USERS, "[]") ?: "[]")

        for (i in 0 until array.length()) {
            val item = array.optJSONObject(i) ?: continue
            users.add(
                BlogUser(
                    username = item.optString("username"),
                    passwordHash = item.optString("passwordHash")
                )
            )
        }

        return users
    }

    private fun saveUsers(users: List<BlogUser>) {
        val array = JSONArray()
        users.forEach { user ->
            array.put(
                JSONObject()
                    .put("username", user.username)
                    .put("passwordHash", user.passwordHash)
            )
        }
        prefs.edit().putString(KEY_USERS, array.toString()).apply()
    }

    private fun saveArticles(articles: List<Article>) {
        val array = JSONArray()
        articles.forEach { article ->
            val comments = JSONArray()
            article.comments.forEach { comment ->
                comments.put(
                    JSONObject()
                        .put("id", comment.id)
                        .put("author", comment.author)
                        .put("text", comment.text)
                        .put("createdAt", comment.createdAt)
                )
            }

            array.put(
                JSONObject()
                    .put("id", article.id)
                    .put("title", article.title)
                    .put("content", article.content)
                    .put("category", article.category)
                    .put("author", article.author)
                    .put("createdAt", article.createdAt)
                    .put("updatedAt", article.updatedAt)
                    .put("comments", comments)
            )
        }
        prefs.edit().putString(KEY_ARTICLES, array.toString()).apply()
    }

    private fun String.sha256(): String {
        val bytes = MessageDigest.getInstance("SHA-256").digest(toByteArray())
        return bytes.joinToString("") { "%02x".format(it.toInt() and 0xff) }
    }

    companion object {
        private const val KEY_USERS = "users"
        private const val KEY_ARTICLES = "articles"
        private const val KEY_CURRENT_USER = "current_user"
    }
}
